import React, { createContext } from "react";


export const HierarchyContext = createContext();

export const HierarchyProvider = ({ children }) => {
    const [teams, setTeams] = React.useState([]);
    const [ceo, setCeo] = React.useState({})
    const [treeChanged, setTreeChanged] = React.useState(false);
    const [departments, setDepartments] = React.useState([]);
    const [teamMembers, setTeamMembers] = React.useState([]);

    return (
      <HierarchyContext.Provider value={{ treeChanged, setTreeChanged, ceo, setCeo, teams, setTeams, departments, setDepartments, teamMembers, setTeamMembers }}>
        {children}
      </HierarchyContext.Provider>
    );
  };  