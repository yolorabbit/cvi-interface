import { useIsTablet } from "components/hooks";
import Tooltip from "components/Tooltip";

const RowItem = ({type, header, content, tooltip}) => {
  const isTablet = useIsTablet();
  return isTablet ? <div className={`row-item-component ${type ?? ''}`}>
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
  </div> : <td>{content}</td>
}

export default RowItem;