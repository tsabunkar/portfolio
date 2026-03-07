/** data/articles.js */
export const ARTICLES_CONTENT = [
  {
    slug: "localhost-to-aws",
    title:
      "From Localhost to Live on AWS: How I Deployed My React Portfolio the Right Way",
    date: "March 2026",
    author: "Tejas Sabunkar",
    readTime: "6 min read",
    heroImage: "/assets/aws_architecture_diagram_hero.png",
    content: `
      <p>Most developers build a portfolio.</p>
      <p>Few architect it.</p>
      <p>Recently, I decided to take my React portfolio beyond simple hosting and deploy it using a production-grade AWS architecture — the same way I would design a real-world system.</p>
      <p>This wasn’t about “just making it live.”</p>
      <p>It was about building it properly.</p>
      <p>Here’s how I did it — and why it matters.</p>

      <hr />

      <h2>The Goal</h2>
      <p>I wanted my portfolio to be:</p>
      <ul>
        <li>Secure (HTTPS everywhere)</li>
        <li>Globally performant</li>
        <li>Infrastructure-as-Code driven</li>
        <li>Scalable</li>
        <li>Architecturally clean</li>
        <li>Easy to extend and redeploy</li>
      </ul>
      <p>Live site: <a href="https://tsabunkar.com/" target="_blank" rel="noopener noreferrer">https://tsabunkar.com/</a></p>

      <hr />

      <h2>The Architecture</h2>
      <p>The frontend is built with React (Vite build output).</p>
      <p>Instead of deploying it to basic hosting platforms, I used:</p>
      <ul>
        <li>Static hosting via Amazon S3</li>
        <li>Global CDN delivery using Amazon CloudFront</li>
        <li>SSL certificate managed by AWS Certificate Manager</li>
        <li>DNS management via Amazon Route 53</li>
        <li>Domain purchased through GoDaddy</li>
        <li>Infrastructure provisioned entirely with Terraform</li>
      </ul>
      <p>This setup ensures:</p>
      <ul>
        <li>Low latency worldwide</li>
        <li>Secure HTTPS connections</li>
        <li>Clean DNS routing</li>
        <li>Edge-level redirect handling (www → root)</li>
        <li>Full infrastructure reproducibility</li>
      </ul>

      <hr />

      <h2>Why Not Just Use Netlify or Vercel?</h2>
      <p>They’re great tools.</p>
      <p>But I wanted:</p>
      <ul>
        <li>Full control</li>
        <li>Production-grade AWS exposure</li>
        <li>Terraform-driven provisioning</li>
        <li>Real architectural depth</li>
      </ul>
      <p>As a Solutions Architect, I believe even small systems should be designed thoughtfully.</p>

      <hr />

      <h2>Infrastructure as Code (Terraform)</h2>
      <p>Every component was created via Terraform:</p>
      <ul>
        <li>S3 bucket (private, not public)</li>
        <li>CloudFront distribution</li>
        <li>ACM certificate (validated via DNS)</li>
        <li>Route 53 hosted zone</li>
        <li>Alias records for root and www</li>
        <li>Canonical redirect configuration</li>
      </ul>
      <p>No manual clicking.</p>
      <p>This means:</p>
      <ul>
        <li>Reproducible infrastructure</li>
        <li>Easy environment replication</li>
        <li>Clean DevOps workflow</li>
      </ul>

      <hr />

      <h2>Handling DNS & Domain Setup</h2>
      <p>One of the most interesting parts was connecting the domain from GoDaddy to Route 53.</p>
      <p>The key steps:</p>
      <ol>
        <li>Create hosted zone in Route 53</li>
        <li>Update nameservers at GoDaddy</li>
        <li>Validate ACM certificate via DNS</li>
        <li>Configure alias records to CloudFront</li>
      </ol>
      <p>Understanding the difference between <strong>Registrar</strong>, <strong>DNS</strong>, <strong>CDN</strong>, and <strong>Certificate validation</strong> is crucial for anyone working in cloud architecture.</p>

      <hr />

      <h2>Making It Responsive</h2>
      <p>The React application was designed mobile-first.</p>
      <p>Responsiveness wasn’t an afterthought — it was tested across:</p>
      <ul>
        <li>Desktop</li>
        <li>Tablet</li>
        <li>Mobile devices</li>
      </ul>
      <p>A portfolio should reflect engineering discipline, not just design aesthetics.</p>

      <hr />

      <h2>Adding a Feature Using Claude (Locally)</h2>
      <p>One of the most interesting experiments was integrating AI into the workflow.</p>
      <p>I used Claude locally to:</p>
      <ul>
        <li>Generate a new feature</li>
        <li>Refactor a component</li>
        <li>Improve structure</li>
        <li>Speed up development iteration</li>
      </ul>
      <p>Then I:</p>
      <ul>
        <li>Built the app</li>
        <li>Deployed to S3</li>
        <li>Invalidated CloudFront cache</li>
        <li>Verified it live in production</li>
      </ul>
      <p>This showed how AI-assisted development fits into real DevOps processes. Not magic — just leverage.</p>

      <hr />

      <h2>Key Lessons</h2>
      <p>1️⃣ <strong>Hosting ≠ Architecture:</strong> Using S3 + CloudFront + Route 53 + ACM forces you to understand how the internet actually works.</p>
      <p>2️⃣ <strong>DNS & HTTPS are where real learning happens:</strong> Propagation delays, certificate validation, root vs www — cloud fundamentals matter.</p>
      <p>3️⃣ <strong>Infrastructure as Code builds discipline:</strong> Terraform removes “click-ops” and forces system thinking.</p>
      <p>4️⃣ <strong>Production mindset is in the details:</strong> Edge redirects, HTTPS enforcement, CDN caching, responsiveness — small decisions define quality.</p>
      <p>5️⃣ <strong>AI accelerates execution, not architecture:</strong> Using Claude helped build faster. But system design still requires human judgment.</p>

      <hr />

      <h2>Why This Matters</h2>
      <p>A portfolio is more than a website.</p>
      <p>It’s a reflection of how you think.</p>
      <p>Anyone can deploy a frontend.</p>
      <p>Architecting it properly shows:</p>
      <ul>
        <li>Systems thinking</li>
        <li>Cloud fluency</li>
        <li>DevOps maturity</li>
        <li>Attention to detail</li>
        <li>Production mindset</li>
      </ul>
      <p>For me, building resilient systems isn’t just work — it’s how I approach everything.</p>

      <hr />

      <p>If you’re building your own portfolio, I’d encourage you: Don’t just host it. Architect it.</p>
      <p>And if you’re experimenting with AI-assisted workflows, integrate it into your deployment process — not just your code editor.</p>
      <p>Would love to hear how others are deploying their frontend apps — simple hosting or full cloud architecture?</p>

      <p><strong>#AWS #ReactJS #Terraform #CloudArchitecture #DevOps #SolutionsArchitect #BuildInPublic #InfrastructureAsCode #CloudFront #Route53</strong></p>
    `,
  },
];
