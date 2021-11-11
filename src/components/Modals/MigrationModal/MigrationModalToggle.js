import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import MigrationModal from '.';

const MigrationModalToggle = () => {
    const { migrationModalIsOpen } = useSelector(({app}) => app);
  
    return useMemo(() => {
        return migrationModalIsOpen && (
            <MigrationModal />
        )
    }, [migrationModalIsOpen]);
}

export default MigrationModalToggle;