// Copyright (c) 2019 smiley <ml.smiley3@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

function Node(point)
{
    this.point = point;

    // Nodes
    this.left = null;
    this.right = null;
}

function KDTree(k)
{
    this.k = k;

    this.root = null; // Only reference the root. Subsequent points will be referenced by their parent node
}

KDTree.prototype.Insert = function(node, point, depth = 0)
{
    if (node == null)
    {
        let newNode = new Node(point);
        this.root = newNode;
        return newNode;
    }

    let dimension = depth % this.k;

    if (point[dimension] < node.point[dimension]) 
        node.left = this.Insert(node.left, point, depth + 1); 
    else
        node.right = this.Insert(node.right, point, depth + 1); 

    this.root = node;
    return node;
};

KDTree.prototype.DeleteNode = function(node, point, depth = 0)
{
    // Given point is not present 
    if (!node) 
        return null; 
  
    // Find dimension of current node 
    let dimension = depth % this.k;

    let equal = true;
    for (let i = 0; i < point.length; i++)
        if (point[i] != node.point[i])
        {
            equal = false;
            break;
        }
  
    // If the point to be deleted is present at root
    if (equal) 
    { 
        // 2.b) If right child is not null 
        if (node.right != null) 
        { 
            // Find minimum of root's dimension in right subtree 
            let min = this.FindMinimum(node.right, dimension); 
  
            // Copy the minimum to root 
            node.point = min.point.clone();
  
            // Recursively delete the minimum 
            node.right = this.DeleteNode(node.right, min.point, depth+1); 
        } 
        else if (node.left != null) // same as above 
        { 
            let min = this.FindMinimum(node.left, dimension); 
            node.point = min.point.slice(0); // clone
            node.right = this.DeleteNode(node.left, min.point, depth+1); 
        } 
        else // If node to be deleted is leaf node 
        { 
            delete node; 
            return null; 
        }
        this.root = node;
        return node; 
    } 
  
    // 2) If current node doesn't contain point, search downward 
    if (point[dimension] < node.point[dimension]) 
        node.left = this.DeleteNode(node.left, point, depth+1); 
    else
        node.right = this.DeleteNode(node.right, point, depth+1);
    
    this.root = node;
    return node; 
};

KDTree.prototype.FindMinimum = function(node, dimension, depth = 0)
{
    // Base cases 
    if (node == null) 
        return null; 
  
    // Current dimension is computed using current depth and total 
    // dimensions (k) 
    let cd = depth % this.k; 
  
    // Compare point with root with respect to cd (Current dimension) 
    if (cd == dimension) 
    { 
        if (node.left == null) 
            return node;
        return this.FindMinimum(node.left, dimension, depth+1); 
    } 
  
    // If current dimension is different then minimum can be anywhere 
    // in this subtree 
    let a = node;
    let b = this.FindMinimum(node.left, dimension, depth+1);
    let c = this.FindMinimum(node.right, dimension, depth+1);
    
    let ret = a;

    if (b != null && b.point[dimension] < ret.point[dimension])
        ret = b; 
    if (c != null && c.point[dimension] < ret.point[dimension]) 
        ret = c;

    return ret;
};

// Uncomment the following block for a quick test
/*
{
    let kd = new KDTree(2);
    let points = [
        [30, 40],
        [10, 12],
        [5, 25],
        [70, 70],
        [50, 30],
        [35, 45]
    ];

    for (let point of points)
    {
        kd.Insert(kd.root, point, 0);
    }

    kd.DeleteNode(kd.root, points[0], 0);

    console.log("Root after deletion of (30, 40)"); 
    console.log(kd.root.point); // should be (35, 45)
}
*/
