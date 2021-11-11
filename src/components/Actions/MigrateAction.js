import React, { useMemo, useState } from "react";
import Button from "components/Elements/Button";
import MigrationModal from "components/Modals/MigrationModal";

const MigrateAction = ({ tokenName }) => {
  const [migrationModalIsOpen, setMigrationModalIsOpen] = useState(false);
 
  return useMemo(() => {
    return <> 
        {migrationModalIsOpen && (
            <MigrationModal
              migrationModalIsOpen={migrationModalIsOpen}
              setMigrationModalIsOpen={setMigrationModalIsOpen}
            />
        )}
        <div className="migrate-component">
          <div className="migrate-component__container">
            {(tokenName === "cvi-usdt-lp" || tokenName === "usdt") && <Button
              className="migrate-component__container--button"
              buttonText="Migrate"
              onClick={() => setMigrationModalIsOpen(true)} 
            />}
          </div>
        </div>
    </>
  }, [migrationModalIsOpen, tokenName]);
};

export default MigrateAction;
