<h1>Microservices using Node Express</h1>
<p>A simple microservices architecture which consists of two apps.</p>
<ol>
  <li>
    Admin App 
    <ul>
      <li>Uses MySql to for CRUD operations for products.</li>
    </ul>
  </li>
  
  <li>
    Main App 
    <ul>
      <li>Uses MongoDB to view products from SQL.</li>
    </ul>
  </li>
  <li>
    RabbitMQ is used as message broker to communicate between these two servers.
  </li>
</ol>
