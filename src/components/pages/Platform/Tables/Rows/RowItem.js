import { useIsTablet } from "components/hooks";

const RowItem = ({type, header, content}) => {
  const isTablet = useIsTablet();
  return isTablet ? <div className={`row-item-component ${type ?? ''}`}>
    {header && isTablet && <span className="row-item-component--title">{header}</span>}
    {content}
  </div> : <td>{content}</td>
}

export default RowItem;