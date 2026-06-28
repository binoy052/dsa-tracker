import requests
import json
import os

categories = [
    {"id": "arrays-hashing", "name": "Arrays & Hashing", "desc": "Fundamental data structures involving contiguous memory and key-value pairs.", "tags": "array"},
    {"id": "two-pointers", "name": "Two Pointers", "desc": "Iterating with multiple pointers to optimize time complexity.", "tags": "two-pointers"},
    {"id": "sliding-window", "name": "Sliding Window", "desc": "Maintaining a window of elements to solve array/string problems.", "tags": "sliding-window"},
    {"id": "stack", "name": "Stack", "desc": "LIFO data structure for tracking elements.", "tags": "stack"},
    {"id": "binary-search", "name": "Binary Search", "desc": "O(log n) search algorithms on sorted data.", "tags": "binary-search"},
    {"id": "linked-list", "name": "Linked List", "desc": "Nodes containing data and pointers to the next node.", "tags": "linked-list"},
    {"id": "trees", "name": "Trees", "desc": "Hierarchical data structure with a root and children nodes.", "tags": "tree"},
    {"id": "trie", "name": "Tries", "desc": "Prefix tree for efficient string operations.", "tags": "trie"},
    {"id": "heap-pq", "name": "Heap / Priority Queue", "desc": "Complete binary tree for keeping track of min/max elements.", "tags": "heap-priority-queue"},
    {"id": "backtracking", "name": "Backtracking", "desc": "Algorithmic technique for solving problems recursively by trying to build a solution incrementally.", "tags": "backtracking"},
    {"id": "graphs", "name": "Graphs", "desc": "Nodes connected by edges, represented by adjacency list or matrix.", "tags": "graph"},
    {"id": "dp-1d", "name": "1-D Dynamic Programming", "desc": "Breaking down problems into simpler subproblems with 1D state.", "tags": "dynamic-programming"},
    {"id": "dp-2d", "name": "2-D Dynamic Programming", "desc": "Dynamic programming with 2D state arrays.", "tags": "dynamic-programming"},
    {"id": "greedy", "name": "Greedy", "desc": "Making locally optimal choices at each stage.", "tags": "greedy"},
    {"id": "math-geometry", "name": "Math & Geometry", "desc": "Mathematical formulations and geometric problems.", "tags": "math"},
    {"id": "bit-manipulation", "name": "Bit Manipulation", "desc": "Direct manipulation of bits to solve problems.", "tags": "bit-manipulation"}
]

query = """
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    questions: data {
      difficulty
      frontendQuestionId: questionFrontendId
      paidOnly: isPaidOnly
      title
      titleSlug
    }
  }
}
"""

seen_ids = set()
dsa_data = []

# Map difficulties
diff_map = {"Easy": "Easy", "Medium": "Medium", "Hard": "Hard"}

for i, cat in enumerate(categories):
    print(f"Fetching for {cat['name']}...")
    
    skip = 0
    # For dp-2d, we skip the first 50 since it shares the same tag as dp-1d
    if cat['id'] == 'dp-2d':
        skip = 50

    variables = {
        "categorySlug": "",
        "skip": skip,
        "limit": 100, # fetch more to filter paid ones
        "filters": {
            "tags": [cat['tags']]
        }
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json"
    }
    
    try:
        res = requests.post("https://leetcode.com/graphql", json={"query": query, "variables": variables}, headers=headers, timeout=10)
        data = res.json()
        
        problems = []
        
        if data.get("data") and data["data"].get("problemsetQuestionList"):
            questions = data["data"]["problemsetQuestionList"]["questions"]
            for q in questions:
                if not q["paidOnly"] and q["titleSlug"] not in seen_ids:
                    seen_ids.add(q["titleSlug"])
                    problems.append({
                        "id": q["titleSlug"],
                        "name": q["title"],
                        "url": f"https://leetcode.com/problems/{q['titleSlug']}/",
                        "difficulty": diff_map.get(q["difficulty"], "Medium")
                    })
                
                if len(problems) == 50:
                    break
                    
        dsa_data.append({
            "id": cat["id"],
            "name": cat["name"],
            "description": cat["desc"],
            "problems": problems
        })
        print(f"Added {len(problems)} problems for {cat['name']}.")
    except Exception as e:
        print(f"Error fetching {cat['name']}: {e}")

js_content = "export const dsaData = " + json.dumps(dsa_data, indent=2) + ";\n"

with open("src/data/questions.js", "w", encoding="utf-8") as f:
    f.write(js_content)
    
print("Done writing to src/data/questions.js")
