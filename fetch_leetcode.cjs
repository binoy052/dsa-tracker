const fs = require('fs');

const categories = [
    {id: "arrays-hashing", name: "Arrays & Hashing", desc: "Fundamental data structures involving contiguous memory and key-value pairs.", tags: "array"},
    {id: "two-pointers", name: "Two Pointers", desc: "Iterating with multiple pointers to optimize time complexity.", tags: "two-pointers"},
    {id: "sliding-window", name: "Sliding Window", desc: "Maintaining a window of elements to solve array/string problems.", tags: "sliding-window"},
    {id: "stack", name: "Stack", desc: "LIFO data structure for tracking elements.", tags: "stack"},
    {id: "binary-search", name: "Binary Search", desc: "O(log n) search algorithms on sorted data.", tags: "binary-search"},
    {id: "linked-list", name: "Linked List", desc: "Nodes containing data and pointers to the next node.", tags: "linked-list"},
    {id: "trees", name: "Trees", desc: "Hierarchical data structure with a root and children nodes.", tags: "tree"},
    {id: "trie", name: "Tries", desc: "Prefix tree for efficient string operations.", tags: "trie"},
    {id: "heap-pq", name: "Heap / Priority Queue", desc: "Complete binary tree for keeping track of min/max elements.", tags: "heap-priority-queue"},
    {id: "backtracking", name: "Backtracking", desc: "Algorithmic technique for solving problems recursively by trying to build a solution incrementally.", tags: "backtracking"},
    {id: "graphs", name: "Graphs", desc: "Nodes connected by edges, represented by adjacency list or matrix.", tags: "graph"},
    {id: "dp-1d", name: "1-D Dynamic Programming", desc: "Breaking down problems into simpler subproblems with 1D state.", tags: "dynamic-programming"},
    {id: "dp-2d", name: "2-D Dynamic Programming", desc: "Dynamic programming with 2D state arrays.", tags: "dynamic-programming"},
    {id: "greedy", name: "Greedy", desc: "Making locally optimal choices at each stage.", tags: "greedy"},
    {id: "math-geometry", name: "Math & Geometry", desc: "Mathematical formulations and geometric problems.", tags: "math"},
    {id: "bit-manipulation", name: "Bit Manipulation", desc: "Direct manipulation of bits to solve problems.", tags: "bit-manipulation"}
];

const query = `
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
`;

const seenIds = new Set();
const dsaData = [];

const diffMap = { "Easy": "Easy", "Medium": "Medium", "Hard": "Hard" };

async function fetchQuestions() {
    for (const cat of categories) {
        console.log(`Fetching for ${cat.name}...`);
        
        let skip = 0;
        if (cat.id === 'dp-2d') skip = 50;

        const variables = {
            categorySlug: "",
            skip: skip,
            limit: 120, // slightly more to filter out paid/seen problems
            filters: { tags: [cat.tags] }
        };

        try {
            const res = await fetch("https://leetcode.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0"
                },
                body: JSON.stringify({ query, variables })
            });

            const data = await res.json();
            const problems = [];

            if (data?.data?.problemsetQuestionList?.questions) {
                const questions = data.data.problemsetQuestionList.questions;
                for (const q of questions) {
                    if (!q.paidOnly && !seenIds.has(q.titleSlug)) {
                        seenIds.add(q.titleSlug);
                        problems.push({
                            id: q.titleSlug,
                            name: q.title,
                            url: `https://leetcode.com/problems/${q.titleSlug}/`,
                            difficulty: diffMap[q.difficulty] || "Medium"
                        });
                    }
                    if (problems.length === 50) break;
                }
            }

            dsaData.push({
                id: cat.id,
                name: cat.name,
                description: cat.desc,
                problems: problems
            });
            console.log(`Added ${problems.length} problems for ${cat.name}.`);
        } catch (e) {
            console.error(`Error fetching ${cat.name}:`, e);
        }
    }

    const jsContent = "export const dsaData = " + JSON.stringify(dsaData, null, 2) + ";\n";
    fs.writeFileSync("src/data/questions.js", jsContent, "utf-8");
    console.log("Done writing to src/data/questions.js");
}

fetchQuestions();
