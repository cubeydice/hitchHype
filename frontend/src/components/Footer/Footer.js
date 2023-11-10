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
    gitHub: "https://github.com/raymondtan676",
    linkedIn: "http://linkedin.com/in/raymondtan676"
  },
  {
    name: "Krikor Andonian",
    gitHub: "https://github.com/Andoniank",
    linkedIn: "http://linkedin.com/in/krikor-andonian-6bb906b0"
  },
  {
    name: "Brittiny Filbert",
    gitHub: "https://github.com/FilbertBrit",
    linkedIn: "http://linkedin.com/in/brittiny-filbert-6b50b3299"
  }
]

const Footer = () => {

  return (
    <div className='footer-container' id='footer' >
      <h3>
        ABOUT US
      </h3>
        <br/><br/>
    <div className='footer-authors'>
      {authors.map((author)=>{
        return (
        <div className='footer-author' key={author.name}>
        {author.name}
        <div className='footer-author-icons'>
          <a href={author.linkedIn} alt='linkedin' target="_blank" rel="noreferrer">
            <img src={LinkedInLogo} alt='linkedin' className='medium-icon'/>
          </a>
          <a href={author.gitHub} alt='github' target="_blank" rel="noreferrer">
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