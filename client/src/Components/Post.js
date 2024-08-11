export default function Post(){
  return(
     <div className="post">
          <div className="image">
             <img src="https://techcrunch.com/wp-content/uploads/2024/07/faulty-crowdstrike-update.jpg" alt="img" />
          </div>
         
         <div className="text">
          <h2>Faulty CrowdStrike update causes major global IT outage, taking out banks</h2>
          <p className="info">
            <a className="author">Accidic</a>
            <time>20-07-2024 14:41</time>
          </p>
          <p className="summary">“This is not a security incident or cyberattack. The issue has been identified, isolated and a fix has been deployed. We refer customers to the support portal for the latest updates and will continue to provide complete and continuous updates on our website.</p>
          </div>
        </div>
    )
}