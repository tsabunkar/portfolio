/** data/articles.js */
export const ARTICLES_CONTENT = [
  {
    slug: "localhost-to-aws",
    title:
      "From Localhost to Live on AWS: How I Deployed My React Portfolio the Right Way",
    date: "Feb 2026",
    author: "Tejas Sabunkar",
    readTime: "6 min read",
    heroImage: "/assets/aws_architecture_diagram_hero.png",
    content: `<p><strong>Architecting a Portfolio Like a Production System</strong></p>

            <p>Most developers build a portfolio. Few architect it.</p>

            <p>Recently, I decided to take my React portfolio beyond simple hosting and deploy it using a production-grade cloud architecture — the same approach I would use when designing a real-world system.</p>

            <p>This exercise wasn’t about simply making a website live. It was about building it the right way — secure, scalable, and architecturally sound.</p>

            <p>Here’s how I approached it, and why the process itself matters.</p>

            <hr />

            <h2>The Objective</h2>

            <p>When designing the deployment, I set a few clear goals. The portfolio needed to be:</p>

            <ul>
            <li>Secure with HTTPS everywhere</li>
            <li>Globally performant</li>
            <li>Managed using Infrastructure as Code</li>
            <li>Scalable and resilient</li>
            <li>Architecturally clean</li>
            <li>Easy to redeploy and extend in the future</li>
            </ul>

            <p>Live site: <a href="https://tsabunkar.com/" target="_blank" rel="noopener noreferrer">https://tsabunkar.com/</a></p>
            <div class="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/s6ZavhRB0TM?si=UoRxCI2HDE9Yv3S-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <hr />

            <h2>Architecture Overview</h2>

            <p>The frontend application is built using React with a Vite build output. Instead of deploying it through a simple hosting platform, I implemented a cloud-native deployment architecture.</p>

            <p>The system consists of:</p>

            <ul>
            <li>Static hosting via Amazon S3</li>
            <li>Global content delivery using Amazon CloudFront</li>
            <li>SSL certificate management through AWS Certificate Manager</li>
            <li>DNS routing with Amazon Route 53</li>
            <li>Domain registration handled through GoDaddy</li>
            <li>Infrastructure provisioned entirely using Terraform</li>
            </ul>

            <p>This setup ensures:</p>

            <ul>
            <li>Low latency delivery worldwide</li>
            <li>Secure HTTPS connections</li>
            <li>Clean DNS routing</li>
            <li>Edge-level redirect handling (www → root)</li>
            <li>Fully reproducible infrastructure</li>
            </ul>

            <hr />

            <h2>Why Not Use Netlify or Vercel?</h2>

            <p>Platforms like Netlify and Vercel are excellent tools and make deployment extremely simple.</p>

            <p>However, my goal for this project was different.</p>

            <p>I wanted:</p>

            <ul>
            <li>Full infrastructure control</li>
            <li>Hands-on experience with production-grade cloud architecture</li>
            <li>Terraform-driven provisioning</li>
            <li>Deeper architectural understanding</li>
            </ul>

            <p>As a Solutions Architect, I believe even small systems benefit from thoughtful design and clean architectural decisions.</p>

            <hr />

            <h2>Infrastructure as Code (Terraform)</h2>

            <p>Every component of the system was provisioned using Terraform.</p>

            <ul>
            <li>Private S3 bucket for hosting assets</li>
            <li>CloudFront distribution for global delivery</li>
            <li>ACM certificate validated via DNS</li>
            <li>Route 53 hosted zone</li>
            <li>Alias records for root and www domains</li>
            <li>Canonical redirect configuration</li>
            </ul>

            <p>No manual configuration was required.</p>

            <p>This approach enables:</p>

            <ul>
            <li>Reproducible infrastructure</li>
            <li>Easy environment replication</li>
            <li>A clean and consistent DevOps workflow</li>
            </ul>

            <hr />

            <h2>DNS and Domain Integration</h2>

            <p>One of the most interesting parts of the setup was connecting the domain purchased through GoDaddy with Route 53.</p>

            <p>The process involved the following steps:</p>

            <ol>
            <li>Create a hosted zone in Route 53</li>
            <li>Update the nameservers in GoDaddy</li>
            <li>Validate the SSL certificate through DNS</li>
            <li>Create alias records pointing to CloudFront</li>
            </ol>

            <p>This highlights the importance of understanding how key internet components interact:</p>

            <ul>
            <li>Domain registrars</li>
            <li>DNS providers</li>
            <li>Content delivery networks</li>
            <li>Certificate validation systems</li>
            </ul>

            <p>These fundamentals are essential for anyone working in cloud architecture.</p>

            <hr />

            <h2>Building a Responsive Experience</h2>

            <p>The React application was designed with a mobile-first approach.</p>

            <p>Responsiveness was tested across:</p>

            <ul>
            <li>Desktop environments</li>
            <li>Tablet devices</li>
            <li>Mobile devices</li>
            </ul>

            <p>A portfolio should reflect engineering discipline — not just design aesthetics.</p>

            <hr />

            <h2>Experimenting with AI-Assisted Development</h2>

            <p>I also experimented with integrating AI into the development workflow using Claude locally.</p>

            <p>It helped with:</p>

            <ul>
            <li>Generating a new feature</li>
            <li>Refactoring a component</li>
            <li>Improving project structure</li>
            <li>Speeding up development iteration</li>
            </ul>

            <p>Once changes were ready, the deployment workflow remained consistent:</p>

            <ol>
            <li>Build the application</li>
            <li>Deploy the build to S3</li>
            <li>Invalidate the CloudFront cache</li>
            <li>Verify the update in production</li>
            </ol>

            <p>This demonstrated how AI can accelerate development without replacing architectural thinking.</p>

            <hr />

            <h2>Key Takeaways</h2>

            <p><strong>1. Hosting is not the same as architecture.</strong><br/>
            Using S3, CloudFront, Route 53, and ACM helps developers understand how the internet infrastructure actually works.</p>

            <p><strong>2. DNS and HTTPS teach real cloud fundamentals.</strong><br/>
            Certificate validation, propagation delays, and domain routing are core cloud concepts.</p>

            <p><strong>3. Infrastructure as Code builds discipline.</strong><br/>
            Terraform eliminates manual configuration and encourages system thinking.</p>

            <p><strong>4. Production quality lives in the details.</strong><br/>
            Edge redirects, HTTPS enforcement, CDN caching strategies, and responsive design all contribute to reliability.</p>

            <p><strong>5. AI accelerates execution, not architecture.</strong><br/>
            Tools like Claude can speed up development, but system design decisions still require human judgment.</p>

            <hr />

            <h2>Why This Matters</h2>

            <p>A portfolio is more than a website. It reflects how you think as an engineer.</p>

            <p>Anyone can deploy a frontend application. Architecting it properly demonstrates:</p>

            <ul>
            <li>Systems thinking</li>
            <li>Cloud fluency</li>
            <li>DevOps maturity</li>
            <li>Attention to detail</li>
            <li>A production mindset</li>
            </ul>

            <p>For me, building resilient systems isn’t just part of my job — it’s how I approach engineering challenges.</p>

            <hr />

            <p>If you’re building your own portfolio, consider going one step further.</p>

            <p><strong>Don’t just host it. Architect it.</strong></p>

            <p>If you're experimenting with AI-assisted workflows, try integrating them into your deployment process — not just your code editor.</p>

            <p>I’d love to hear how others are deploying their frontend applications: simple hosting platforms or full cloud architecture?</p>

            <p><strong>#AWS #ReactJS #Terraform #CloudArchitecture #DevOps #SolutionsArchitect #InfrastructureAsCode #CloudFront #Route53</strong></p>`,
  },
  {
    slug: "hiv-awareness-website",
    title:
      "From Git Push to Global Impact: Engineering an HIV Awareness Platform",
    date: "March 2026",
    author: "Tejas Sabunkar",
    readTime: "4 min read",
    heroImage: "/assets/hiv-awareness.png",
    content: `<h2>Building a CI/CD System with Jenkins, Terraform, and AWS — for a Social Awareness Project</h2>
            <p>
            Modern software engineering is no longer just about writing application code. The real challenge is how quickly and reliably that code reaches production.
            </p>

            <p>
            High-performing engineering teams solve this with CI/CD pipelines, automation, and Infrastructure as Code. Instead of manual deployments, the entire release process becomes a system that runs automatically.
            </p>

            <p>
            In this project, I built a production-style CI/CD architecture where pushing code triggers a full deployment pipeline — building an Angular application and publishing it live on the internet.
            </p>

            <p><strong>But this project has another purpose.</strong></p>

            <p>
            The website was created to spread awareness about HIV and contribute toward reducing stigma through accessible information. Technology is powerful not only for building products, but also for sharing knowledge and driving social awareness.
            </p>

            <p>
            The solution integrates GitHub, Jenkins, Terraform, and scalable infrastructure from Amazon Web Services.
            </p>

            <p>Live site: <a href="https://d59s5g9yk2nky.cloudfront.net/" target="_blank" rel="noopener noreferrer">https://d59s5g9yk2nky.cloudfront.net/</a></p>
            <div class="video-container">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/aMh91uK5pYk?si=2MziiL5XbAQ4e9kI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <hr />

            <h2>The Problem with Traditional Deployments</h2>

            <p>Not long ago, deployments often looked like this:</p>

            <ul>
            <li>Build the application locally</li>
            <li>Upload files manually to servers</li>
            <li>Restart services</li>
            <li>Clear caches manually</li>
            </ul>

            <p>This approach creates several challenges:</p>

            <ul>
            <li>High chances of human error</li>
            <li>Inconsistent environments</li>
            <li>Slow release cycles</li>
            <li>Difficult rollbacks</li>
            </ul>

            <p>
            Modern DevOps practices aim to remove manual steps entirely.
            </p>

            <p><strong>A developer pushes code → the system builds and deploys automatically.</strong></p>

            <hr>

            <h2>The Architecture Behind the System</h2>

            <p>
            The CI/CD pipeline connects multiple cloud components that automate the entire delivery process.
            </p>

            <h3>Source Control</h3>
            <ul>
            <li>Application code lives in GitHub</li>
            <li>Developers push changes through Git</li>
            </ul>

            <h3>CI/CD Automation</h3>
            <ul>
            <li>Jenkins acts as the pipeline engine</li>
            <li>Automatically builds and deploys the application</li>
            </ul>

            <h3>Compute Infrastructure</h3>
            <ul>
            <li>Jenkins runs on an instance hosted on Amazon EC2</li>
            <li>Persistent storage is provided by Amazon Elastic Block Store</li>
            </ul>

            <h3>Application Hosting</h3>
            <ul>
            <li>Static build artifacts are deployed to Amazon S3</li>
            </ul>

            <h3>Global Content Delivery</h3>
            <ul>
            <li>The website is delivered worldwide through Amazon CloudFront</li>
            </ul>

            <p>
            This architecture is widely used for modern frontend deployments at scale.
            </p>

            <hr>

            <h2>What Actually Happens After a Code Push</h2>

            <p>
            Once the system is configured, the deployment pipeline becomes completely automated.
            </p>

            <p><strong>A developer simply runs:</strong></p>

            <pre><code>git push origin main</code></pre>

            <p>Behind the scenes, several automated processes begin:</p>

            <ul>
            <li>GitHub sends a webhook event</li>
            <li>Jenkins triggers the CI/CD pipeline</li>
            <li>The Angular application is built automatically</li>
            <li>Build artifacts are uploaded to Amazon S3</li>
            <li>Amazon CloudFront cache is invalidated</li>
            <li>The updated website becomes live globally</li>
            </ul>

            <p>
            A single code push now triggers an end-to-end automated deployment.
            </p>

            <hr>

            <h2>Infrastructure as Code Changes Everything</h2>

            <p>
            A major part of this architecture relies on Infrastructure as Code, implemented using Terraform.
            </p>

            <p>
            Instead of manually provisioning servers and networking components, the entire infrastructure stack is defined through configuration files.
            </p>

            <p>This introduces powerful engineering benefits:</p>

            <ul>
            <li>Infrastructure becomes version-controlled</li>
            <li>Environments can be recreated instantly</li>
            <li>Deployments remain consistent across environments</li>
            <li>Broken environments can be rebuilt in minutes</li>
            </ul>

            <p>
            This approach reflects how modern platform teams manage cloud infrastructure.
            </p>

            <hr>

            <h2>Cloud Optimization in Practice</h2>

            <p>
            Another important aspect of cloud architecture is cost optimization.
            </p>

            <p>
            During development, the Jenkins server running on Amazon EC2 initially used a <strong>t3.medium</strong> instance.
            </p>

            <p>
            After evaluating the workload, the instance was resized to <strong>t3.small</strong>. The pipeline continued to perform efficiently while reducing infrastructure cost.
            </p>

            <p><strong>Always right-size resources based on actual workload needs.</strong></p>

            <p>
            Small infrastructure optimizations can significantly improve long-term cost efficiency.
            </p>

            <hr>

            <h2>Real DevOps Engineering</h2>

            <p>
            Building automated systems rarely works perfectly on the first attempt.
            </p>

            <p>
            Like most real-world DevOps projects, this system required multiple iterations to stabilize.
            </p>

            <p>Common engineering tasks included:</p>

            <ul>
            <li>Debugging Terraform configurations</li>
            <li>Rebuilding infrastructure environments</li>
            <li>Fixing Jenkins pipeline issues</li>
            <li>Validating the end-to-end deployment flow</li>
            </ul>

            <p>
            These challenges are part of the real DevOps workflow — systems improve through testing, debugging, and continuous refinement.
            </p>

            <hr>

            <h2>Technologies Used</h2>

            <ul>
            <li>Angular – Frontend application</li>
            <li>Jenkins – CI/CD automation</li>
            <li>Terraform – Infrastructure as Code</li>
            <li>GitHub – Source code management</li>
            <li>Amazon EC2 – Compute infrastructure</li>
            <li>Amazon S3 – Static website hosting</li>
            <li>Amazon CloudFront – Global CDN delivery</li>
            </ul>

            <p>
            Together they create a complete automated deployment ecosystem.
            </p>

            <hr>

            <h2>Technology with Purpose</h2>

            <p>
            While the architecture demonstrates DevOps practices, the purpose of the project is equally important.
            </p>

            <p>
            The website was built to share information and encourage open conversation about HIV, helping reduce misinformation and stigma.
            </p>

            <p>
            Technology often focuses on scale and efficiency — but it can also play a role in spreading awareness and making information accessible.
            </p>

            <p>
            Sometimes the most meaningful projects are not just about building systems, but about using engineering skills to support social impact.
            </p>

            <hr>

            <h2>Final Thoughts</h2>

            <p>
            The goal of modern engineering is not just writing software — it is building systems that deliver software automatically and reliably.
            </p>

            <p>
            By combining Jenkins pipelines, Infrastructure as Code using Terraform, and scalable services from Amazon Web Services, developers can create powerful automation workflows.
            </p>

            <p>
            And in this case, that automation helps support a simple mission:
            </p>

            <p><strong>Using technology to share knowledge and reduce stigma around HIV.</strong> 🚀</p>
            `,
  },
];
