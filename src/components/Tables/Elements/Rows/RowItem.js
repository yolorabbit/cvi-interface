import { useIsTablet } from "components/Hooks";
import { useDataController } from "components/Tables/DataController/DataController";
import Tooltip from "components/Tooltip";

const RowItem = ({token, type, header, content, tooltip, hide}) => {
  const isTablet = useIsTablet();
  const { activeTab } = useDataController();

  if(hide) return <div className=""></div>;
  return isTablet ? <div className={`row-item-component ${type ?? ''} ${activeTab ?? ''}`}>
    {!hide && <> 
      {header && isTablet && <span className="row-item-component--title">
        {header} 
        {tooltip && <Tooltip 
          type="question" 
          left={tooltip?.left ?? -30} 
          mobileLeft={tooltip?.mobileLeft} 
          maxWidth={400} 
          minWidth={250} 
          content={tooltip?.content} 
        />}
      </span>}
      {content}
    </>}
  </div> : <td className={token ? `row-item-component--${token}` : ''}>{content}</td>
}

export default RowItem;