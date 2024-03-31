import { BiSolidError } from "react-icons/bi";
import { BiLinkExternal } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function Error() {

    const navigate=useNavigate();
  return (
    <div className="no-page-found">
      <BiSolidError style={{color: "red"}}/>
      <div>Page not found</div>
      <div className="goto-home" onClick={()=>navigate("/home",{replace:true})}>Go to home <BiLinkExternal/></div>
    </div>
  );
}

export default Error;
