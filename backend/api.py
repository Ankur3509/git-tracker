"""
Flask API wrapper for the GitHub Tracker Agent
Provides REST endpoints for the frontend to interact with the agent
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add parent directory to path to import agent
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import (
    app as agent_app,
    load_previous_metrics,
    save_current_metrics,
    load_history,
    Gitstate,
    METRICS_FILE
)
import requests
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Store connected repositories (in production, use a database)
# Store connected repositories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPOS_FILE = os.path.join(BASE_DIR, "connected_repos.json")

def load_repos():
    """Load connected repositories from file"""
    if not os.path.exists(REPOS_FILE):
        return []
    with open(REPOS_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_repos(repos):
    """Save connected repositories to file"""
    with open(REPOS_FILE, 'w') as f:
        json.dump(repos, f, indent=2)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/repos', methods=['GET'])
def get_repos():
    """Get all connected repositories"""
    repos = load_repos()
    return jsonify({"repos": repos})

@app.route('/api/repos', methods=['POST'])
def add_repo():
    """Add a new repository to track"""
    data = request.json
    repo_url = data.get('repo_url', '').strip()
    if repo_url.endswith('/'):
        repo_url = repo_url[:-1]
        
    if not repo_url or 'github.com' not in repo_url:
        return jsonify({"error": "Invalid GitHub URL"}), 400
    
    parts = repo_url.split('/')
    
    # handle https://github.com/owner/repo
    # handle github.com/owner/repo
    # handle https://www.github.com/owner/repo
    
    try:
        # find the part that contains github.com
        if 'github.com' in parts:
             idx = parts.index('github.com')
        elif 'www.github.com' in parts:
             idx = parts.index('www.github.com')
        else:
             # Fallback: assume last two are owner/repo if github.com is in string but not exact match in split
             # e.g. some-other-prefix.github.com/.. (though unlikely for main repo)
             # just take last two non-empty parts
             non_empty = [p for p in parts if p]
             if len(non_empty) < 2:
                  return jsonify({"error": "Invalid GitHub URL format"}), 400
             owner = non_empty[-2]
             name = non_empty[-1]
             idx = -999 # skip next block

        if idx != -999:
            if len(parts) < idx + 3:
                return jsonify({"error": "Invalid GitHub URL format (missing owner or repo)"}), 400
            owner = parts[idx+1]
            name = parts[idx+2]
            
    except Exception as e:
         return jsonify({"error": f"Failed to parse URL: {str(e)}"}), 400
    
    repos = load_repos()
    
    # Check if repo already exists
    if any(r['url'] == repo_url for r in repos):
        return jsonify({"error": "Repository already connected"}), 400
    
    new_repo = {
        "id": len(repos) + 1,
        "url": repo_url,
        "owner": owner,
        "name": name,
        "added_at": datetime.now().isoformat(),
        "last_checked": None
    }
    
    repos.append(new_repo)
    save_repos(repos)
    
    return jsonify({"repo": new_repo}), 201

@app.route('/api/repos/<int:repo_id>', methods=['DELETE'])
def delete_repo(repo_id):
    """Remove a repository from tracking"""
    repos = load_repos()
    repos = [r for r in repos if r['id'] != repo_id]
    save_repos(repos)
    return jsonify({"success": True})

@app.route('/api/metrics/<int:repo_id>', methods=['GET'])
def get_metrics(repo_id):
    """Get current metrics for a repository"""
    repos = load_repos()
    repo = next((r for r in repos if r['id'] == repo_id), None)
    
    if not repo:
        return jsonify({"error": "Repository not found"}), 404
    
    # Get previous metrics
    previous_metrics = load_previous_metrics(repo['url'])
    
    # Run the agent to get current metrics
    try:
        result = agent_app.invoke({
            "repo_url": repo['url'],
            "social_type": "linkedin",  # Default to linkedin
            "previous_metrics": previous_metrics or {
                "stars": 0,
                "views": 0,
                "uni_view": 0,
                "clone": 0,
                "uni_clone": 0
            }
        })
        
        # Update last checked time
        repo['last_checked'] = datetime.now().isoformat()
        save_repos(repos)
        
        return jsonify({
            "repo": repo,
            "current": {
                "stars": result.get('stars', 0),
                "views": result.get('view', 0),
                "unique_views": result.get('unique_views', 0),
                "clones": result.get('clones', 0),
                "unique_clones": result.get('unique_clone', 0)
            },
            "previous": previous_metrics,
            "summary": result.get('summary_ans', ''),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summary/<int:repo_id>', methods=['POST'])
def generate_summary(repo_id):
    """Generate AI summary for a repository"""
    repos = load_repos()
    repo = next((r for r in repos if r['id'] == repo_id), None)
    
    if not repo:
        return jsonify({"error": "Repository not found"}), 404
    
    data = request.json
    social_type = data.get('social_type', 'linkedin')  # 'linkedin' or 'x'
    
    previous_metrics = load_previous_metrics(repo['url'])
    
    try:
        result = agent_app.invoke({
            "repo_url": repo['url'],
            "social_type": social_type,
            "previous_metrics": previous_metrics or {
                "stars": 0,
                "views": 0,
                "uni_view": 0,
                "clone": 0,
                "uni_clone": 0
            }
        })
        
        return jsonify({
            "summary": result.get('summary_ans', ''),
            "post": result.get('post', ''),
            "social_type": social_type,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    """Get aggregated dashboard data for all repos"""
    repos = load_repos()
    
    total_stars = 0
    total_views = 0
    total_clones = 0
    repo_data = []

    metrics_history = {}
    if os.path.exists(METRICS_FILE):
        with open(METRICS_FILE, 'r') as f:
            try:
                metrics_history = json.load(f)
            except:
                pass

    for repo in repos:
        metrics = metrics_history.get(repo['url'], [])
        
        # Handle list vs dict
        if isinstance(metrics, dict):
             metrics = [metrics]
             
        latest = metrics[-1] if metrics else {}
        
        stars = latest.get('stars', 0)
        views = latest.get('view', 0)
        clones = latest.get('clones', 0)
        
        total_stars += stars
        total_views += views
        total_clones += clones
        
        repo_data.append({
            **repo,
            "stars": stars,
            "views": views,
            "clones": clones,
            "growth": "+5%" # Placeholder for trend logic
        })

    return jsonify({
        "total_repos": len(repos),
        "total_stars": total_stars,
        "total_views": total_views,
        "total_clones": total_clones,
        "repos": repo_data,
        "last_updated": datetime.now().isoformat()
    })

@app.route('/api/sync', methods=['POST'])
def sync_all():
    """Manually trigger sync for all repositories"""
    repos = load_repos()
    results = []
    
    for repo in repos:
        try:
            previous_metrics = load_previous_metrics(repo['url'])
            agent_app.invoke({
                "repo_url": repo['url'],
                "social_type": "linkedin",
                "previous_metrics": previous_metrics or {
                    "stars": 0, "views": 0, "uni_view": 0, "clone": 0, "uni_clone": 0
                }
            })
            repo['last_checked'] = datetime.now().isoformat()
            results.append({"repo": repo['name'], "status": "success"})
        except Exception as e:
            results.append({"repo": repo['name'], "status": "error", "message": str(e)})
    
    save_repos(repos)
    return jsonify({"results": results})

@app.route('/api/history/<int:repo_id>', methods=['GET'])
def get_repo_history(repo_id):
    """Get metric history for charts"""
    repos = load_repos()
    repo = next((r for r in repos if r['id'] == repo_id), None)
    if not repo:
        return jsonify({"error": "Repository not found"}), 404
        
    history = load_history(repo['url'])
    return jsonify(history)

@app.route('/api/commits/<int:repo_id>', methods=['GET'])
def get_repo_commits(repo_id):
    """Get recent commits for timeline"""
    repos = load_repos()
    repo = next((r for r in repos if r['id'] == repo_id), None)
    if not repo:
        return jsonify({"error": "Repository not found"}), 404

    # Fetch commits via GitHub API
    try:
        url = f"https://api.github.com/repos/{repo['owner']}/{repo['name']}/commits?per_page=5"
        # Optional: Use token if available to avoid rate limits
        token = os.getenv("GITHUB_TOKEN")
        headers = {"User-Agent": "git-tracker"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            return jsonify(resp.json())
        return jsonify([])
    except Exception as e:
        print(f"Error fetching commits: {e}")
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
