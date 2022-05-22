import React from 'react'
import { HierarchyContext } from '../../context/hierarchyContext';

function HeadFilter() {

    const [head, setHead] = React.useState('');
    const {ceo} = React.useContext(HierarchyContext);

    function findHeadInTree(headName) {
        let queue = [ceo];
        let level = 0;
        while (queue.length) {
            level += 1;
            let length = queue.length;
            for (let i = 0; i < length; i ++) {
                let currentNode = queue.shift();
                if (currentNode.childrens == null) continue;
                for (let node of currentNode.childrens) {
                    if (node.name.toLowerCase() == headName) return node;
                    queue.push(node);
                }
            }
        }
        setTreeChanged(!treeChanged);
        window.alert('Removed team ', teamName); 
    }

    /*function getEmployeesBelow(text) {
        let headName = text.trim().toLowerCase();
        let headNode = findHeadInTree(headName);
        let queue = [headNode];

        while(queue.length) {
            let length = queue.length;
            for (let i = 0; i < length; i ++) {
                let currentNode = queue.shift();
                if (!currentNode.childrens) continue;
                for (let node of currentNode.childrens) {
                    if (node.email) {
                        result.push({
                            name: node.name,
                            email: node.email,
                            phone: node.phNum,
                            department: node.
                        });
                    }
                    queue.push(node);
                }
            }
        }
    }*/


  return (
    <div className='head-filter'>
        <input onChange={(e) => setHead(e.target.value)} placeholder="" type="text" />
        <button>View Employees down hierarchy</button>
        <div>

        </div>
    </div>
  )
}

export default HeadFilter