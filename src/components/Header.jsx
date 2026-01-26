import GitHub from '../assets/github-svgrepo-com.svg'
import LinkedIn from '../assets/linkedin-svgrepo-com (1).svg'
import RedirectionButton from "../components/RedirectionButton.jsx";


export default function Header() {
    const buttonParameters = [
    {
      name: "GitHub",
      url: "https://github.com/U-S-MOHANLAL",
      icon: <img src={GitHub} alt="GitHub" style={{ marginRight: "8px", width: "20px", height: "20px" }} /> ,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mohanlal-s-7723603a2/",
      icon: <img src={LinkedIn} alt="LinkedIn" style={{ marginRight: "8px", width: "22px", height: "22px" }} /> ,
    },
  ];
  return (
    <div className="header grid grid-flow-col">
      <div>
        <p className="title">Ascension Tracker</p>
      </div>
      <div className='justify-self-end'>
        {RedirectionButton(buttonParameters)}
      </div>
    </div>
  )
} 
