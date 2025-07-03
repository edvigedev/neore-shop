export default function HomePage() {
  return (
    <div>
        <nav className="nav-bar">
            <div className="neore-logo"> Neore</div>
            <ul className="nav-bar-links">
                <li>My Profile</li>
                <li>Logout</li>
                <li><button className="cart-button">
                    <img src="./src/assets/cart.png" alt="Cart" />
                    </button>
                </li>
            </ul>
        </nav>
        <div className="home-page-container">
      <h1 className="home-page-title">Explore high-quality products and exclusive offers!</h1>
      <aside>
        <h3> DID YOU KNOW?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        </aside>
        <section>
            <div>
                <img src="https://via.placeholder.com/150" alt="Product 1" />
            </div>
        </section>
        </div>
    </div>
  );
}