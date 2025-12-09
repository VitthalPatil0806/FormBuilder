import { useNavigate } from 'react-router'
import '../index.css'
export function WelcomeSection () {
    const navigate = useNavigate();
    return (
        <>
            <h1 className='title'>Welcome To Resume Builder</h1>
            <button className='startbtn' onClick={()=> navigate("/login")}>Get Started</button>
        </>
    )
}