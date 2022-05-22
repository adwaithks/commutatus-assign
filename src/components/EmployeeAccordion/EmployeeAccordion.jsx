import React from 'react'
import {BsCaretDown} from 'react-icons/bs';
import {AiOutlineDelete} from 'react-icons/ai';
import {FiEdit3} from 'react-icons/fi';
import { HierarchyContext } from '../../context/hierarchyContext';
import './EmployeeAccordion.css'

function EmployeeAccordion({props, teamName, departmentName}) {
    const {ceo, treeChanged, setTreeChanged} = React.useContext(HierarchyContext);
    const [expanded, setExpanded] = React.useState(true);

    function expandHandler() {
        setExpanded(!expanded);
    }

    function removeTeamMember(email) {
        let queue = [ceo];
        let level = 0;
        while (queue.length) {
            level += 1;
            let length = queue.length;
            for (let i = 0; i < length; i ++) {
                let currentNode = queue.shift();
                if (currentNode.childrens == null) continue;
                for (let node of currentNode.childrens) {
                    if (level == 3 && currentNode.name.trim() == teamName.trim() && currentNode.parent.name.trim() == departmentName.trim()) {
                        currentNode.childrens = currentNode.childrens.filter((child, idx) => {
                            if(child.email.trim() != email.trim()) {
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
        window.alert('Removed employee ', email);    
    }

    function editTeamMember(employeeEmail) {
        let queue = [ceo];
        let level = 0;
        while (queue.length) {
            level += 1;
            let length = queue.length;
            for (let i = 0; i < length; i ++) {
                let currentNode = queue.shift();
                if (currentNode.childrens == null) continue;
                for (let node of currentNode.childrens) {
                    if (level == 3 && currentNode.name.trim() == teamName.trim() && currentNode.parent.name.trim() == departmentName.trim()) {
                        for (let employee of currentNode.childrens) {
                            if (employee.email == employeeEmail.trim()) {
                                if (name) employee.name = name;
                                if (phone) employee.phNum = phone;
                                if (email) employee.email = email;
                            }
                        }
                    }
                    queue.push(node);
                }
            }
        }
        setEditDisabled(true);
        setTreeChanged(!treeChanged);
        window.alert('Edited employee ', email);    
    }

    const [editDisabled, setEditDisabled] = React.useState(true);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');


    function setNameHandler(e) {
        setName(e.target.value);
    }

    function setPhoneHandler(e) {
        setPhone(e.target.value);
    }

    function setEmailHandler(e) {
        setEmail(e.target.value);
    }



  return (
    <div className='employee-accordion'>
        <h4 className='employee-accordion-name'>
            {props.name} {props?.teamLead ? '(TL)' : (null)} 
            <BsCaretDown onClick={expandHandler} className='caret-down-icon' /> 
            {
                !editDisabled ? (
                    <button onClick={() => {editTeamMember(props.email)}}>Save</button>
                ) : null
            }
            <FiEdit3 onClick={() => {setEditDisabled(!editDisabled)}} className='edit-icon' /> 
            <AiOutlineDelete onClick={() => removeTeamMember(props.email)} className='delete-icon' />
        </h4>
        {
            expanded ? (
                <>
                    <input onChange={setNameHandler} className='employee-accordion-input' value={name ? name : props.name} disabled={editDisabled}/>
                    <input onChange={setPhoneHandler} className='employee-accordion-input' value={phone ? phone : props.phNum} disabled={editDisabled}/>
                    <input onChange={setEmailHandler} className='employee-accordion-input' value={email ? email : props.email} disabled={editDisabled}/>
                </>
            ) : (null)
        }
        
    </div>
  )
}

export default EmployeeAccordion