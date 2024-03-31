import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Back(){
    const navigate=useNavigate();
    return <div className="back">
    <IoChevronBackCircle onClick={()=>navigate(-1)}/>
    </div>
}

export default Back;