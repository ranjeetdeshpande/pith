import '../../../packages/core/src/styles/tokens.css'
import '../../../packages/core/src/styles/themes.css'
import '@pith/ui'

// ── Types ──────────────────────────────────────────────────────────────────
type Difficulty = 'easy' | 'medium' | 'hard'
type Status     = 'todo' | 'attempted' | 'solved' | 'review'

interface Problem {
  id:         string
  name:       string
  url:        string
  topic:      string
  difficulty: Difficulty
  status:     Status
  notes:      string
}

// ── Seed (NeetCode 150) ────────────────────────────────────────────────────
type Seed = Omit<Problem, 'id' | 'status' | 'notes'>
const SEED: Seed[] = [
  // Arrays & Hashing
  { name: 'Contains Duplicate',                         topic: 'Arrays & Hashing',  difficulty: 'easy',   url: 'https://leetcode.com/problems/contains-duplicate/' },
  { name: 'Valid Anagram',                              topic: 'Arrays & Hashing',  difficulty: 'easy',   url: 'https://leetcode.com/problems/valid-anagram/' },
  { name: 'Two Sum',                                    topic: 'Arrays & Hashing',  difficulty: 'easy',   url: 'https://leetcode.com/problems/two-sum/' },
  { name: 'Group Anagrams',                             topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/group-anagrams/' },
  { name: 'Top K Frequent Elements',                    topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { name: 'Product of Array Except Self',               topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { name: 'Valid Sudoku',                               topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/valid-sudoku/' },
  { name: 'Encode and Decode Strings',                  topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/encode-and-decode-strings/' },
  { name: 'Longest Consecutive Sequence',               topic: 'Arrays & Hashing',  difficulty: 'medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
  // Two Pointers
  { name: 'Valid Palindrome',                           topic: 'Two Pointers',       difficulty: 'easy',   url: 'https://leetcode.com/problems/valid-palindrome/' },
  { name: 'Two Sum II',                                 topic: 'Two Pointers',       difficulty: 'medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
  { name: '3Sum',                                       topic: 'Two Pointers',       difficulty: 'medium', url: 'https://leetcode.com/problems/3sum/' },
  { name: 'Container With Most Water',                  topic: 'Two Pointers',       difficulty: 'medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
  { name: 'Trapping Rain Water',                        topic: 'Two Pointers',       difficulty: 'hard',   url: 'https://leetcode.com/problems/trapping-rain-water/' },
  // Sliding Window
  { name: 'Best Time to Buy and Sell Stock',            topic: 'Sliding Window',     difficulty: 'easy',   url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { name: 'Longest Substring Without Repeating Chars', topic: 'Sliding Window',     difficulty: 'medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { name: 'Longest Repeating Character Replacement',   topic: 'Sliding Window',     difficulty: 'medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
  { name: 'Permutation in String',                      topic: 'Sliding Window',     difficulty: 'medium', url: 'https://leetcode.com/problems/permutation-in-string/' },
  { name: 'Minimum Window Substring',                   topic: 'Sliding Window',     difficulty: 'hard',   url: 'https://leetcode.com/problems/minimum-window-substring/' },
  { name: 'Sliding Window Maximum',                     topic: 'Sliding Window',     difficulty: 'hard',   url: 'https://leetcode.com/problems/sliding-window-maximum/' },
  // Stack
  { name: 'Valid Parentheses',                          topic: 'Stack',              difficulty: 'easy',   url: 'https://leetcode.com/problems/valid-parentheses/' },
  { name: 'Min Stack',                                  topic: 'Stack',              difficulty: 'medium', url: 'https://leetcode.com/problems/min-stack/' },
  { name: 'Evaluate Reverse Polish Notation',           topic: 'Stack',              difficulty: 'medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  { name: 'Generate Parentheses',                       topic: 'Stack',              difficulty: 'medium', url: 'https://leetcode.com/problems/generate-parentheses/' },
  { name: 'Daily Temperatures',                         topic: 'Stack',              difficulty: 'medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
  { name: 'Car Fleet',                                  topic: 'Stack',              difficulty: 'medium', url: 'https://leetcode.com/problems/car-fleet/' },
  { name: 'Largest Rectangle in Histogram',             topic: 'Stack',              difficulty: 'hard',   url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
  // Binary Search
  { name: 'Binary Search',                              topic: 'Binary Search',      difficulty: 'easy',   url: 'https://leetcode.com/problems/binary-search/' },
  { name: 'Search a 2D Matrix',                         topic: 'Binary Search',      difficulty: 'medium', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
  { name: 'Koko Eating Bananas',                        topic: 'Binary Search',      difficulty: 'medium', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
  { name: 'Find Minimum in Rotated Sorted Array',       topic: 'Binary Search',      difficulty: 'medium', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { name: 'Search in Rotated Sorted Array',             topic: 'Binary Search',      difficulty: 'medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { name: 'Time Based Key-Value Store',                 topic: 'Binary Search',      difficulty: 'medium', url: 'https://leetcode.com/problems/time-based-key-value-store/' },
  { name: 'Median of Two Sorted Arrays',                topic: 'Binary Search',      difficulty: 'hard',   url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  // Linked List
  { name: 'Reverse Linked List',                        topic: 'Linked List',        difficulty: 'easy',   url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { name: 'Merge Two Sorted Lists',                     topic: 'Linked List',        difficulty: 'easy',   url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { name: 'Linked List Cycle',                          topic: 'Linked List',        difficulty: 'easy',   url: 'https://leetcode.com/problems/linked-list-cycle/' },
  { name: 'Reorder List',                               topic: 'Linked List',        difficulty: 'medium', url: 'https://leetcode.com/problems/reorder-list/' },
  { name: 'Remove Nth Node From End',                   topic: 'Linked List',        difficulty: 'medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { name: 'Copy List with Random Pointer',              topic: 'Linked List',        difficulty: 'medium', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { name: 'Add Two Numbers',                            topic: 'Linked List',        difficulty: 'medium', url: 'https://leetcode.com/problems/add-two-numbers/' },
  { name: 'LRU Cache',                                  topic: 'Linked List',        difficulty: 'medium', url: 'https://leetcode.com/problems/lru-cache/' },
  { name: 'Merge K Sorted Lists',                       topic: 'Linked List',        difficulty: 'hard',   url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { name: 'Reverse Nodes in K-Group',                   topic: 'Linked List',        difficulty: 'hard',   url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
  // Trees
  { name: 'Invert Binary Tree',                         topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/invert-binary-tree/' },
  { name: 'Maximum Depth of Binary Tree',               topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { name: 'Diameter of Binary Tree',                    topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { name: 'Balanced Binary Tree',                       topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/balanced-binary-tree/' },
  { name: 'Same Tree',                                  topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/same-tree/' },
  { name: 'Subtree of Another Tree',                    topic: 'Trees',              difficulty: 'easy',   url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
  { name: 'Lowest Common Ancestor of BST',              topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { name: 'Binary Tree Level Order Traversal',          topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { name: 'Binary Tree Right Side View',                topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
  { name: 'Count Good Nodes in Binary Tree',            topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
  { name: 'Validate Binary Search Tree',                topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { name: 'Kth Smallest Element in BST',                topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
  { name: 'Construct Binary Tree from Preorder+Inorder',topic: 'Trees',              difficulty: 'medium', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { name: 'Binary Tree Maximum Path Sum',               topic: 'Trees',              difficulty: 'hard',   url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { name: 'Serialize and Deserialize Binary Tree',      topic: 'Trees',              difficulty: 'hard',   url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
  // Tries
  { name: 'Implement Trie (Prefix Tree)',               topic: 'Tries',              difficulty: 'medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
  { name: 'Design Add and Search Words',                topic: 'Tries',              difficulty: 'medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
  { name: 'Word Search II',                             topic: 'Tries',              difficulty: 'hard',   url: 'https://leetcode.com/problems/word-search-ii/' },
  // Heap
  { name: 'Kth Largest Element in a Stream',            topic: 'Heap',               difficulty: 'easy',   url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
  { name: 'Last Stone Weight',                          topic: 'Heap',               difficulty: 'easy',   url: 'https://leetcode.com/problems/last-stone-weight/' },
  { name: 'K Closest Points to Origin',                 topic: 'Heap',               difficulty: 'medium', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
  { name: 'Kth Largest Element in an Array',            topic: 'Heap',               difficulty: 'medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { name: 'Task Scheduler',                             topic: 'Heap',               difficulty: 'medium', url: 'https://leetcode.com/problems/task-scheduler/' },
  { name: 'Design Twitter',                             topic: 'Heap',               difficulty: 'medium', url: 'https://leetcode.com/problems/design-twitter/' },
  { name: 'Find Median from Data Stream',               topic: 'Heap',               difficulty: 'hard',   url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
  // Backtracking
  { name: 'Subsets',                                    topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/subsets/' },
  { name: 'Combination Sum',                            topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/combination-sum/' },
  { name: 'Permutations',                               topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/permutations/' },
  { name: 'Subsets II',                                 topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/subsets-ii/' },
  { name: 'Combination Sum II',                         topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/combination-sum-ii/' },
  { name: 'Word Search',                                topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/word-search/' },
  { name: 'Palindrome Partitioning',                    topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/palindrome-partitioning/' },
  { name: 'Letter Combinations of a Phone Number',      topic: 'Backtracking',       difficulty: 'medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
  { name: 'N-Queens',                                   topic: 'Backtracking',       difficulty: 'hard',   url: 'https://leetcode.com/problems/n-queens/' },
  // Graphs
  { name: 'Number of Islands',                          topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/number-of-islands/' },
  { name: 'Clone Graph',                                topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/clone-graph/' },
  { name: 'Max Area of Island',                         topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/max-area-of-island/' },
  { name: 'Pacific Atlantic Water Flow',                topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { name: 'Surrounded Regions',                         topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/surrounded-regions/' },
  { name: 'Rotting Oranges',                            topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/rotting-oranges/' },
  { name: 'Course Schedule',                            topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/course-schedule/' },
  { name: 'Course Schedule II',                         topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/course-schedule-ii/' },
  { name: 'Graph Valid Tree',                           topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/graph-valid-tree/' },
  { name: 'Number of Connected Components',             topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  { name: 'Redundant Connection',                       topic: 'Graphs',             difficulty: 'medium', url: 'https://leetcode.com/problems/redundant-connection/' },
  { name: 'Word Ladder',                                topic: 'Graphs',             difficulty: 'hard',   url: 'https://leetcode.com/problems/word-ladder/' },
  // Advanced Graphs
  { name: 'Reconstruct Itinerary',                      topic: 'Advanced Graphs',    difficulty: 'hard',   url: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  { name: 'Min Cost to Connect All Points',             topic: 'Advanced Graphs',    difficulty: 'medium', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
  { name: 'Network Delay Time',                         topic: 'Advanced Graphs',    difficulty: 'medium', url: 'https://leetcode.com/problems/network-delay-time/' },
  { name: 'Swim in Rising Water',                       topic: 'Advanced Graphs',    difficulty: 'hard',   url: 'https://leetcode.com/problems/swim-in-rising-water/' },
  { name: 'Alien Dictionary',                           topic: 'Advanced Graphs',    difficulty: 'hard',   url: 'https://leetcode.com/problems/alien-dictionary/' },
  { name: 'Cheapest Flights Within K Stops',            topic: 'Advanced Graphs',    difficulty: 'medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
  // 1-D DP
  { name: 'Climbing Stairs',                            topic: '1-D DP',             difficulty: 'easy',   url: 'https://leetcode.com/problems/climbing-stairs/' },
  { name: 'Min Cost Climbing Stairs',                   topic: '1-D DP',             difficulty: 'easy',   url: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
  { name: 'House Robber',                               topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/house-robber/' },
  { name: 'House Robber II',                            topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/house-robber-ii/' },
  { name: 'Longest Palindromic Substring',              topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { name: 'Palindromic Substrings',                     topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/palindromic-substrings/' },
  { name: 'Decode Ways',                                topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/decode-ways/' },
  { name: 'Coin Change',                                topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/coin-change/' },
  { name: 'Maximum Product Subarray',                   topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { name: 'Word Break',                                 topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/word-break/' },
  { name: 'Longest Increasing Subsequence',             topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { name: 'Partition Equal Subset Sum',                 topic: '1-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
  // 2-D DP
  { name: 'Unique Paths',                               topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/unique-paths/' },
  { name: 'Longest Common Subsequence',                 topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { name: 'Buy and Sell Stock with Cooldown',           topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
  { name: 'Coin Change II',                             topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/coin-change-2/' },
  { name: 'Target Sum',                                 topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/target-sum/' },
  { name: 'Interleaving String',                        topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/interleaving-string/' },
  { name: 'Longest Increasing Path in Matrix',          topic: '2-D DP',             difficulty: 'hard',   url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
  { name: 'Distinct Subsequences',                      topic: '2-D DP',             difficulty: 'hard',   url: 'https://leetcode.com/problems/distinct-subsequences/' },
  { name: 'Edit Distance',                              topic: '2-D DP',             difficulty: 'medium', url: 'https://leetcode.com/problems/edit-distance/' },
  { name: 'Burst Balloons',                             topic: '2-D DP',             difficulty: 'hard',   url: 'https://leetcode.com/problems/burst-balloons/' },
  { name: 'Regular Expression Matching',                topic: '2-D DP',             difficulty: 'hard',   url: 'https://leetcode.com/problems/regular-expression-matching/' },
  // Greedy
  { name: 'Maximum Subarray',                           topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
  { name: 'Jump Game',                                  topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/jump-game/' },
  { name: 'Jump Game II',                               topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/jump-game-ii/' },
  { name: 'Gas Station',                                topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/gas-station/' },
  { name: 'Hand of Straights',                          topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/hand-of-straights/' },
  { name: 'Merge Triplets to Form Target Triplet',      topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
  { name: 'Partition Labels',                           topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/partition-labels/' },
  { name: 'Valid Parenthesis String',                   topic: 'Greedy',             difficulty: 'medium', url: 'https://leetcode.com/problems/valid-parenthesis-string/' },
  // Intervals
  { name: 'Insert Interval',                            topic: 'Intervals',          difficulty: 'medium', url: 'https://leetcode.com/problems/insert-interval/' },
  { name: 'Merge Intervals',                            topic: 'Intervals',          difficulty: 'medium', url: 'https://leetcode.com/problems/merge-intervals/' },
  { name: 'Non-overlapping Intervals',                  topic: 'Intervals',          difficulty: 'medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
  { name: 'Meeting Rooms',                              topic: 'Intervals',          difficulty: 'easy',   url: 'https://leetcode.com/problems/meeting-rooms/' },
  { name: 'Meeting Rooms II',                           topic: 'Intervals',          difficulty: 'medium', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  { name: 'Minimum Interval to Include Each Query',     topic: 'Intervals',          difficulty: 'hard',   url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' },
  // Math & Geometry
  { name: 'Rotate Image',                               topic: 'Math & Geometry',    difficulty: 'medium', url: 'https://leetcode.com/problems/rotate-image/' },
  { name: 'Spiral Matrix',                              topic: 'Math & Geometry',    difficulty: 'medium', url: 'https://leetcode.com/problems/spiral-matrix/' },
  { name: 'Set Matrix Zeroes',                          topic: 'Math & Geometry',    difficulty: 'medium', url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { name: 'Happy Number',                               topic: 'Math & Geometry',    difficulty: 'easy',   url: 'https://leetcode.com/problems/happy-number/' },
  { name: 'Plus One',                                   topic: 'Math & Geometry',    difficulty: 'easy',   url: 'https://leetcode.com/problems/plus-one/' },
  { name: 'Pow(x, n)',                                  topic: 'Math & Geometry',    difficulty: 'medium', url: 'https://leetcode.com/problems/powx-n/' },
  { name: 'Multiply Strings',                           topic: 'Math & Geometry',    difficulty: 'medium', url: 'https://leetcode.com/problems/multiply-strings/' },
  // Bit Manipulation
  { name: 'Single Number',                              topic: 'Bit Manipulation',   difficulty: 'easy',   url: 'https://leetcode.com/problems/single-number/' },
  { name: 'Number of 1 Bits',                           topic: 'Bit Manipulation',   difficulty: 'easy',   url: 'https://leetcode.com/problems/number-of-1-bits/' },
  { name: 'Counting Bits',                              topic: 'Bit Manipulation',   difficulty: 'easy',   url: 'https://leetcode.com/problems/counting-bits/' },
  { name: 'Reverse Bits',                               topic: 'Bit Manipulation',   difficulty: 'easy',   url: 'https://leetcode.com/problems/reverse-bits/' },
  { name: 'Missing Number',                             topic: 'Bit Manipulation',   difficulty: 'easy',   url: 'https://leetcode.com/problems/missing-number/' },
  { name: 'Sum of Two Integers',                        topic: 'Bit Manipulation',   difficulty: 'medium', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
  { name: 'Reverse Integer',                            topic: 'Bit Manipulation',   difficulty: 'medium', url: 'https://leetcode.com/problems/reverse-integer/' },
]

const TOPIC_ORDER = [
  'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack',
  'Binary Search', 'Linked List', 'Trees', 'Tries', 'Heap',
  'Backtracking', 'Graphs', 'Advanced Graphs',
  '1-D DP', '2-D DP', 'Greedy', 'Intervals',
  'Math & Geometry', 'Bit Manipulation',
]

// ── Storage ────────────────────────────────────────────────────────────────
const KEY = 'pith-dsa-v1'

function load(): Problem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Problem[]
  } catch { /* ignore */ }
  const seeded = SEED.map((s, i) => ({ ...s, id: `s${i}`, status: 'todo' as Status, notes: '' }))
  save(seeded)
  return seeded
}

function save(data: Problem[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

// ── State ──────────────────────────────────────────────────────────────────
let problems  = load()
let topic     = 'ALL'
let statusF: Status | 'all' = 'all'
let diffF:   Difficulty | 'all' = 'all'
let query     = ''
let expanded: string | null = null

// Timer
let duration   = 45 * 60
let remaining  = duration
let running    = false
let ticker: ReturnType<typeof setInterval> | null = null

// ── Helpers ────────────────────────────────────────────────────────────────
const NEXT: Record<Status, Status> = { todo: 'attempted', attempted: 'solved', solved: 'review', review: 'todo' }
const ICON: Record<Status, string> = { todo: '○', attempted: '~', solved: '✓', review: '!' }

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function safeUrl(s: string) {
  return /^https?:\/\//i.test(s) ? s.replace(/"/g, '%22') : '#'
}

function uid() { return `u${Date.now()}${Math.random().toString(36).slice(2, 5)}` }

function topics(): string[] {
  const present = new Set(problems.map(p => p.topic))
  return TOPIC_ORDER.filter(t => present.has(t))
    .concat([...present].filter(t => !TOPIC_ORDER.includes(t)))
}

function filtered() {
  return problems.filter(p =>
    (topic === 'ALL' || p.topic === topic) &&
    (statusF === 'all' || p.status === statusF) &&
    (diffF   === 'all' || p.difficulty === diffF) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  )
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderSidebar() {
  const all    = problems.length
  const solved = problems.filter(p => p.status === 'solved').length
  let html = `<div class="topic-item${topic === 'ALL' ? ' active' : ''}" data-topic="ALL">
    <span>ALL</span><span class="topic-count">${solved}/${all}</span></div>`
  for (const t of topics()) {
    const tot = problems.filter(p => p.topic === t).length
    const sol = problems.filter(p => p.topic === t && p.status === 'solved').length
    html += `<div class="topic-item${topic === t ? ' active' : ''}" data-topic="${esc(t)}">
      <span>${esc(t)}</span><span class="topic-count">${sol}/${tot}</span></div>`
  }
  document.getElementById('topic-nav')!.innerHTML = html
}

function renderFilters() {
  const vis = filtered()
  const sol = vis.filter(p => p.status === 'solved').length

  const sChips: Array<{ k: Status | 'all'; l: string }> = [
    { k: 'all', l: 'ALL' }, { k: 'todo', l: '○ TODO' },
    { k: 'attempted', l: '~ ATTEMPTED' }, { k: 'solved', l: '✓ SOLVED' }, { k: 'review', l: '! REVIEW' },
  ]
  const dChips: Array<{ k: Difficulty | 'all'; l: string }> = [
    { k: 'all', l: 'ALL' }, { k: 'easy', l: 'EASY' }, { k: 'medium', l: 'MEDIUM' }, { k: 'hard', l: 'HARD' },
  ]

  document.getElementById('filter-bar')!.innerHTML =
    sChips.map(c => `<button class="chip${statusF === c.k ? ' on' : ''}" data-sf="${c.k}">${c.l}</button>`).join('') +
    `<span class="chip-sep"></span>` +
    dChips.map(c => `<button class="chip${diffF === c.k ? ' on' : ''}" data-df="${c.k}">${c.l}</button>`).join('') +
    `<span class="chip-sep"></span>` +
    `<button class="chip" id="add-toggle">+ ADD</button>` +
    `<span class="stats">${sol}/${vis.length} solved</span>`
}

function renderList() {
  const list = document.getElementById('problem-list')!
  const vis  = filtered()
  if (!vis.length) { list.innerHTML = `<div class="empty">no problems match</div>`; return }

  list.innerHTML = vis.map(p => `
    <div class="problem-row${expanded === p.id ? ' open' : ''}" data-id="${p.id}">
      <button class="status-btn" data-s="${p.status}" data-act="status" data-id="${p.id}"
        title="cycle status (${p.status})">${ICON[p.status]}</button>
      <span class="problem-name" data-act="notes" data-id="${p.id}">${esc(p.name)}</span>
      <span class="diff ${p.difficulty}">${p.difficulty.toUpperCase()}</span>
      ${p.url ? `<a class="ext-link" href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">↗</a>` : ''}
    </div>
    ${expanded === p.id ? `<div class="notes-row"><textarea
      placeholder="patterns, edge cases, time complexity…"
      data-act="notes-edit" data-id="${p.id}">${esc(p.notes)}</textarea></div>` : ''}
  `).join('')
}

function render() {
  renderSidebar()
  renderFilters()
  renderList()
}

// ── Timer ──────────────────────────────────────────────────────────────────
function updateTimer() {
  const disp  = document.getElementById('timer-display')!
  const hint  = document.getElementById('timer-hint')!
  const start = document.getElementById('timer-start')!
  disp.textContent = fmt(remaining)
  disp.className   = 'timer-display' + (running ? ' running' : remaining === 0 ? ' done' : '')
  if (running) { hint.textContent = 'stay focused'; start.textContent = 'PAUSE' }
  else if (remaining === 0) { hint.textContent = "time's up!"; start.textContent = 'START' }
  else { hint.textContent = remaining < duration ? 'paused' : 'set a duration and start'; start.textContent = remaining < duration ? 'RESUME' : 'START' }
}

function toggleTimer() {
  if (running) {
    clearInterval(ticker!); running = false; updateTimer(); return
  }
  if (remaining === 0) remaining = duration
  running = true
  ticker = setInterval(() => {
    remaining--
    if (remaining <= 0) { remaining = 0; clearInterval(ticker!); running = false }
    updateTimer()
  }, 1000)
  updateTimer()
}

function resetTimer() {
  clearInterval(ticker!); running = false; remaining = duration; updateTimer()
}

// ── Wire ───────────────────────────────────────────────────────────────────
function wire() {
  // View toggle
  const pv = document.getElementById('problems-view')!
  const tv = document.getElementById('timer-view')!
  document.getElementById('btn-problems')!.addEventListener('click', () => {
    pv.style.display = ''; tv.style.display = 'none'
  })
  document.getElementById('btn-timer')!.addEventListener('click', () => {
    pv.style.display = 'none'; tv.style.display = 'flex'
  })

  // Dark mode
  document.getElementById('dark-btn')!.addEventListener('click', () => {
    const dark = document.documentElement.toggleAttribute('data-dark')
    document.getElementById('dark-btn')!.textContent = dark ? 'LIGHT' : 'DARK'
  })

  // Search
  document.getElementById('search-inp')!.addEventListener('pith-input', e => {
    query = (e as CustomEvent<{ value: string }>).detail.value
    render()
  })

  // Sidebar
  document.getElementById('topic-nav')!.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-topic]')?.dataset['topic']
    if (t !== undefined) { topic = t; render() }
  })

  // Filter bar (delegated — re-queried after render)
  document.getElementById('filter-bar')!.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.chip')
    if (!btn) return
    if (btn.id === 'add-toggle') { document.getElementById('add-form')!.classList.toggle('open'); return }
    if (btn.dataset['sf']) { statusF = btn.dataset['sf'] as Status | 'all'; render() }
    if (btn.dataset['df']) { diffF   = btn.dataset['df'] as Difficulty | 'all'; render() }
  })

  // Problem list actions
  document.getElementById('problem-list')!.addEventListener('click', e => {
    const el  = e.target as HTMLElement
    const act = el.dataset['act'] ?? el.closest<HTMLElement>('[data-act]')?.dataset['act']
    const id  = el.dataset['id']  ?? el.closest<HTMLElement>('[data-id]')?.dataset['id']
    if (!act || !id) return
    if (act === 'status') {
      const p = problems.find(x => x.id === id)
      if (p) { p.status = NEXT[p.status]; save(problems); render() }
    }
    if (act === 'notes') { expanded = expanded === id ? null : id; renderList() }
  })

  // Notes save on blur
  document.getElementById('problem-list')!.addEventListener('blur', e => {
    const ta = e.target as HTMLTextAreaElement
    if (ta.dataset['act'] !== 'notes-edit') return
    const p = problems.find(x => x.id === ta.dataset['id'])
    if (p) { p.notes = ta.value; save(problems) }
  }, true)

  // Add form
  const topicSel = document.getElementById('f-topic') as HTMLSelectElement
  topicSel.innerHTML = topics().map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')

  document.getElementById('add-submit')!.addEventListener('click', () => {
    const name = (document.getElementById('f-name') as HTMLInputElement).value.trim()
    if (!name) return
    const t    = (document.getElementById('f-topic') as HTMLSelectElement).value
    const diff = (document.getElementById('f-diff')  as HTMLSelectElement).value as Difficulty
    const url  = (document.getElementById('f-url')   as HTMLInputElement).value.trim()
    problems.push({ id: uid(), name, topic: t, difficulty: diff, url, status: 'todo', notes: '' })
    save(problems)
    ;(document.getElementById('f-name') as HTMLInputElement).value = ''
    ;(document.getElementById('f-url')  as HTMLInputElement).value = ''
    document.getElementById('add-form')!.classList.remove('open')
    render()
  })
  document.getElementById('add-cancel')!.addEventListener('click', () => {
    document.getElementById('add-form')!.classList.remove('open')
  })

  // Timer
  document.getElementById('timer-start')!.addEventListener('click', toggleTimer)
  document.getElementById('timer-reset')!.addEventListener('click', resetTimer)
  document.getElementById('timer-slider')!.addEventListener('pith-change', e => {
    const val = Number((e as CustomEvent<{ value: string | number }>).detail.value)
    duration = val * 60
    if (!running) { remaining = duration; updateTimer() }
  })
}

// ── Boot ───────────────────────────────────────────────────────────────────
render()
wire()
updateTimer()
