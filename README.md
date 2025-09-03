Welcome to the Neore-shop! This project simulates a real-world e-commerce platform, complete with product listings, user profiles, and an admin section.
This e-commerce application was built to showcase the principles of modern web development using **React**. The goal is to demonstrate how core concepts like component architecture and state management.


## Homepage

| Web  | Mobile |
| ---- | ------ |
| <img width="1371" height="747" alt="Screenshot 2025-09-03 at 09 25 39" src="https://github.com/user-attachments/assets/d8355497-449f-44c3-9d18-6250e81d76d1" />| <img width="413" height="915" alt="Screenshot 2025-09-03 at 09 26 04" src="https://github.com/user-attachments/assets/96d6055b-db18-49dd-9854-fb94729dd85f" />|



## Features

This application is divided into several key missions, each adding a new layer of functionality:

*   **Product Exploration**:
    *   Browse a comprehensive list of products fetched from a live API ([DummyJSON](https://dummyjson.com/)).
    *   View detailed information for each product, including its name, price, rating, and description.
    *   See aN Aside section with a random quote.

*   **Personalization**:
    *   Add products to a personal "Favorites" list that saves your choices in the browser.
    *   A special indicator shows which products you've favorited.

*   **User and Cart Management**:
    *   View a list of all users on the platform.
    *   Click on a user to see their profile and a summary of their shopping carts.
    *   Each cart summary displays the total price, number of items, and a list of products.

*   **Admin Dashboard**:
    *   Log in to a secure admin area with a special username and password.
    *   Once logged in, you can view all products and even edit their names and prices.
    *   This section is protected, so only authorized users can access it.


## Tech Stack

### Core Framework: React

*   **React**: A popular JavaScript library for building user interfaces. It allows us to create reusable "components" that make the code clean and efficient.
*   **React Router**: This library handles navigation within the application, allowing you to move between pages without reloading the entire site.


### Styling and UI

*   **CSS (with Flexbox/Grid)**: We used modern CSS techniques to create a responsive layout that adapts to different screen sizes.
*   **clsx**: A small utility for conditionally applying CSS classes. This is useful for things like changing a button's style when it's active.



### Development and Quality Assurance

*   **Vite**: A fast and modern build tool that makes the development process smooth and quick.
*   **ESLint & Prettier**: These tools help maintain code quality by automatically checking for errors and formatting the code to keep it consistent and readable.
*   **Playwright**: A powerful tool for end-to-end testing. 
*   **TypeScript**: We used TypeScript to add "types" to our code. This helps prevent common bugs by making sure we're using data correctly.



### Data Management

*   **DummyJSON**: We used this free online service to get realistic-looking data for our products, users, and carts, just like a real application would.
*   **localStorage**: A feature of your web browser that allows us to save small amounts of data, like your list of favorite products, so it's still there when you revisit the site.



## Future Improvements

*   **User Authentication with a Real Database**: Move beyond simulated logins with hard-coded credentials and connect the app to a real database for persistent user accounts.
*   **Expanded Test Coverage**: Add more component-specific and visual regression tests to catch even the smallest bugs.
