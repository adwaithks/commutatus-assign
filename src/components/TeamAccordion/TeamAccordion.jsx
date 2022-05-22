import React from 'react'
import {BsCaretDown} from 'react-icons/bs';
import {AiOutlineDelete} from 'react-icons/ai';
import EmployeeAccordion from '../EmployeeAccordion/EmployeeAccordion';
import './TeamAccordion.css'
import { HierarchyContext } from '../../context/hierarchyContext';

function TeamAccordion({teamName, teamMembers, departmentName}) {


    const {ceo, treeChanged, setTreeChanged} = React.useContext(HierarchyContext);
    const [expanded, setExpanded] = React.useState(false);


    function expandHandler() {
        setExpanded(!expanded);
    }

    function removeTeam() {
        let queue = [ceo];
        let level = 0;
        while (queue.length) {
            level += 1;
            let length = queue.length;
            for (let i = 0; i < length; i ++) {
                let currentNode = queue.shift();
                if (currentNode.childrens == null) continue;
                for (let node of currentNode.childrens) {
                    if (level == 2 && currentNode.name.trim() == departmentName.trim()) {
                        currentNode.childrens = currentNode.childrens.filter((child, idx) => {
                            if(child.name.trim() != teamName.trim()) {
                                return true;
                            } else {
                                child.parent = null;
                                return false;
                            }
                        });
                    }
                    queue.push(node);
                }
            }
        }
        setTreeChanged(!treeChanged);
        window.alert('Removed team ', teamName);    
    }

    
  return (
    <div className='team-accordion'>
        <div className='team-accordion-tab' onClick={expandHandler}>
            <div className='team-accordion-head'>
                <span className='team-accordion-label'>Team</span>
                <h4 className='team-accordion-name'>{teamName}</h4>
            </div>
            <AiOutlineDelete className='team-delete-icon' onClick={removeTeam} />
            <BsCaretDown className='caret-down-icon' />
        </div>
        {
            expanded ? (
                <div className='employee-container'>
                    {
                        teamMembers.map((member, idx) => (
                            <EmployeeAccordion key={idx} props={member} teamName={teamName} departmentName={departmentName} />
                        ))
                    }
                </div>
            ) : (null)
        }
        
    </div>
  )
}

export default TeamAccordion