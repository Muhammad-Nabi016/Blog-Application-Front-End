# Codomax Blog App

A responsive blog application frontend developed as a project for Codomax Digital Solutions. The application allows users to create, publish, edit, delete, and view blog posts through a simple and user-friendly interface.

## Features

- **Home Page:** Displays sample blog posts and dynamically added published blogs.
- **Login Page:** Frontend form validation for login fields.
- **Register Page:** Frontend form validation for registration fields.
- **Dashboard:** Displays total blogs, published blogs, drafts, and recent posts.
- **Create Blog:** Create new blog posts with a title, category, image URL, and content.
- **Publish and Draft:** Publish a blog or save it as a draft.
- **Blog Details:** View the complete content of a published blog.
- **Edit Blog:** Update existing blog posts.
- **Delete Blog:** Remove blog posts with confirmation.
- **Local Storage:** Save blog data in the browser so it remains available after refreshing the page.
- **Responsive Design:** Designed to work on desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage

## Project Structure

```text
Codomax-Blog-App/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## How to Run the Project

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in your browser, or run the project using the VS Code Live Server extension.
4. Navigate through the Home, Login, Register, Dashboard, and Create Blog pages.
5. Create, publish, edit, or delete blog posts and test the dashboard.

## Data Storage

This version uses the browser's Local Storage to save blog posts. The data is stored in the current browser and is not shared between different browsers or devices.

**Note:** Login and registration currently use frontend validation only. Real authentication, backend APIs, and database integration are not included in this frontend version.

## Future Improvements

- Backend API integration
- Database integration
- Secure user authentication
- User-specific blog management
- Image upload functionality
- Blog search and filtering

## Project Status

Frontend development and functional testing completed.

