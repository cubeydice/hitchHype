import GitHubLogo from '../../assets/logos/github-mark.png'
import LinkedInLogo from '../../assets/logos/linkedin-blue.png'
import './Footer.css'

const authors = [
  {
    name: "Queen Belle Dela Cruz",
    gitHub: "https://github.com/cubeydice/",
    linkedIn: "https://www.linkedin.com/in/queen-belle-d-118b7859/"
  },
  {
    name: "Raymond Tan",
    gitHub: "https://github.com/ratan-ml",
    linkedIn: "http://linkedin.com/in/raymondtan-py"
  },
  {
    name: "Krikor Andonian",
    gitHub: "https://github.com/Andoniank",
    linkedIn: "www.linkedin.com/in/krikor-andonian-6bb906b0"
  },
  {
    name: "Brittiny Filbert",
    gitHub: "https://github.com/FilbertBrit",
    linkedIn: ""
  }
]

const Footer = () => {

  return (
    <div className='footer-container'>
      <h3>
        ABOUT US
      </h3>
        <br/><br/>
    <div className='footer'>
      {authors.map((author)=>{
        return (
        <div className='footer-items'>
        {author.name}
        <div>
          <a href={author.linkedIn} alt='linkedin'>
            <img src={LinkedInLogo} alt='linkedin' className='medium-icon'/>
          </a>
          <a href={author.gitHub} alt='linkedin'>
            <img src={GitHubLogo} alt='github' className='medium-icon'/>
          </a>
        </div>
      </div>)
      })}
    </div>
    </div>
  )
}

export default Footer;