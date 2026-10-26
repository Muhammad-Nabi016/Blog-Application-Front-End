
// Check that JavaScript is connected to the page.
console.log("BlogSpace frontend loaded successfully!");

// Select all blog cards.
const blogCards = document.querySelectorAll(".blog-card");

// Display the number of sample blog posts in the browser console.
console.log(`Total sample blog posts: ${blogCards.length}`);

/* Shared helper for displaying form errors */

function showFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.toggle("input-error", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* LOGIN FORM */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail");
        const password = document.getElementById("loginPassword");

        const emailError = document.getElementById("loginEmailError");
        const passwordError = document.getElementById("loginPasswordError");
        const message = document.getElementById("loginMessage");

        let isValid = true;

        message.textContent = "";
        message.className = "form-message";

        showFieldError(email, emailError, "");
        showFieldError(password, passwordError, "");

        if (!isValidEmail(email.value.trim())) {
            showFieldError(email, emailError, "Enter a valid email address.");
            isValid = false;
        }

        
if (password.value.length === 0) {
    showFieldError(
        password,
        passwordError,
        "Password is required."
    );
    isValid = false;
} else if (password.value.length < 8) {
    showFieldError(
        password,
        passwordError,
        "Password must be at least 8 characters."
    );
    isValid = false;
}


        if (!isValid) {
            message.textContent = "Please correct the errors above.";
            message.classList.add("error");
            return;
        }

        message.textContent =
            "Frontend validation passed. Backend authentication is not connected yet.";
        message.classList.add("success");
    });
}

/* REGISTER FORM */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName");
        const email = document.getElementById("registerEmail");
        const password = document.getElementById("registerPassword");
        const confirmPassword = document.getElementById("confirmPassword");

        const nameError = document.getElementById("registerNameError");
        const emailError = document.getElementById("registerEmailError");
        const passwordError = document.getElementById("registerPasswordError");
        const confirmError = document.getElementById("confirmPasswordError");
        const message = document.getElementById("registerMessage");

        let isValid = true;

        message.textContent = "";
        message.className = "form-message";

        showFieldError(name, nameError, "");
        showFieldError(email, emailError, "");
        showFieldError(password, passwordError, "");
        showFieldError(confirmPassword, confirmError, "");

        if (name.value.trim().length < 2) {
            showFieldError(name, nameError, "Enter your full name.");
            isValid = false;
        }

        if (!isValidEmail(email.value.trim())) {
            showFieldError(email, emailError, "Enter a valid email address.");
            isValid = false;
        }

        if (password.value.length < 8) {
            showFieldError(
                password,
                passwordError,
                "Password must be at least 8 characters."
            );
            isValid = false;
        }

        if (confirmPassword.value !== password.value) {
            showFieldError(
                confirmPassword,
                confirmError,
                "Passwords do not match."
            );
            isValid = false;
        }

        if (!isValid) {
            message.textContent = "Please correct the errors above.";
            message.classList.add("error");
            return;
        }

        message.textContent =
            "Frontend validation passed. Backend registration is not connected yet.";
        message.classList.add("success");
    });
}


/* ===== BLOG STORAGE AND UTILITIES ===== */

// Get saved blogs from browser storage
function getBlogs() {
    try {
        return JSON.parse(localStorage.getItem("blogSpaceBlogs")) || [];
    } catch (error) {
        return [];
    }
}

// Save blogs to browser storage
function saveBlogs(blogs) {
    localStorage.setItem("blogSpaceBlogs", JSON.stringify(blogs));
}

// Create a safe text element
function createTextElement(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;

    if (className) {
        element.className = className;
    }

    return element;
}


/* ===== CREATE AND EDIT BLOG PAGE ===== */

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
    const titleInput = document.getElementById("blogTitle");
    const categoryInput = document.getElementById("blogCategory");
    const imageInput = document.getElementById("blogImage");
    const contentInput = document.getElementById("blogContent");
    const blogMessage = document.getElementById("blogMessage");
    const saveDraftBtn = document.getElementById("saveDraftBtn");

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    const existingBlog = editId
        ? getBlogs().find(blog => blog.id === editId)
        : null;

    function showBlogMessage(message, type) {
        blogMessage.textContent = message;
        blogMessage.className = "blog-message " + type;
    }

    // Load existing blog data when editing
    if (editId && !existingBlog) {
        showBlogMessage(
            "Blog not found. It may have already been deleted.",
            "error"
        );

        createBlogForm.querySelectorAll("input, select, textarea, button")
            .forEach(element => {
                element.disabled = true;
            });
    }

    if (existingBlog) {
        titleInput.value = existingBlog.title;
        categoryInput.value = existingBlog.category;
        imageInput.value = existingBlog.image || "";
        contentInput.value = existingBlog.content;
        document.title = "Edit Blog | BlogSpace";

        const heading = document.querySelector(".create-blog-heading h1");
        if (heading) heading.textContent = "Edit Your Blog";

        const publishButton = createBlogForm.querySelector(
            'button[type="submit"]'
        );

        if (publishButton) {
            publishButton.textContent = "Update & Publish";
        }

        saveDraftBtn.textContent = "Update Draft";
    }

    function validateBlog() {
        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const content = contentInput.value.trim();
        const image = imageInput.value.trim();

        if (!title || !category || !content) {
            showBlogMessage(
                "Please fill in the title, category, and content.",
                "error"
            );
            return false;
        }

        if (content.length < 20) {
            showBlogMessage(
                "Blog content must contain at least 20 characters.",
                "error"
            );
            return false;
        }

        if (image) {
            try {
                const url = new URL(image);

                if (
                    url.protocol !== "https:" &&
                    url.protocol !== "http:"
                ) {
                    throw new Error("Invalid image URL");
                }
            } catch {
                showBlogMessage(
                    "Enter a valid image URL or leave it empty.",
                    "error"
                );
                return false;
            }
        }

        return true;
    }

    function saveBlog(status) {
        if (!validateBlog()) return;

        const blogs = getBlogs();

        const blogData = {
            id: existingBlog ? existingBlog.id : Date.now().toString(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            image: imageInput.value.trim(),
            content: contentInput.value.trim(),
            status: status,
            createdAt: existingBlog
                ? existingBlog.createdAt
                : new Date().toLocaleDateString()
        };

        if (existingBlog) {
            const index = blogs.findIndex(
                blog => blog.id === existingBlog.id
            );

            if (index === -1) {
                showBlogMessage("This blog no longer exists.", "error");
                return;
            }

            blogs[index] = blogData;
        } else {
            blogs.unshift(blogData);
        }

        saveBlogs(blogs);

        showBlogMessage(
            status === "published"
                ? "Blog published/updated successfully!"
                : "Draft saved/updated successfully!",
            "success"
        );

        // Return to dashboard after successful save
        window.location.href = "dashboard.html";
    }

    createBlogForm.addEventListener("submit", function (event) {
        event.preventDefault();
        saveBlog("published");
    });

    saveDraftBtn.addEventListener("click", function () {
        saveBlog("draft");
    });
}


/* ===== HOME PAGE: SHOW PUBLISHED BLOGS ===== */

const homeBlogContainer = document.getElementById("dynamicBlogContainer");

if (homeBlogContainer) {
    const publishedBlogs = getBlogs().filter(
        blog => blog.status === "published"
    );

    publishedBlogs.forEach(blog => {
        const card = document.createElement("article");
        card.className = "blog-card";

        if (blog.image) {
            const image = document.createElement("img");
            image.src = blog.image;
            image.alt = blog.title;
            image.className = "blog-card-image";
            image.loading = "lazy";
            card.appendChild(image);
        }

        card.appendChild(
            createTextElement("span", blog.category, "blog-category")
        );

        
const titleLink = document.createElement("a");
titleLink.href = "blog-details.html?id=" + encodeURIComponent(blog.id);
titleLink.className = "blog-title-link";
titleLink.style.textDecoration = "none";
titleLink.style.color = "inherit";

const titleElement = createTextElement(
    "h3",
    blog.title,
    "blog-card-title"
);

titleLink.appendChild(titleElement);
card.appendChild(titleLink);

// Make the rest of the card open the same blog
card.style.cursor = "pointer";

card.addEventListener("click", function (event) {
    if (event.target.closest("a")) return;

    window.location.href =
        "blog-details.html?id=" + encodeURIComponent(blog.id);
});


        const shortContent = blog.content.length > 140
            ? blog.content.slice(0, 140) + "..."
            : blog.content;

        card.appendChild(
            createTextElement("p", shortContent, "blog-card-description")
        );

        card.appendChild(
            createTextElement("small", "Published: " + blog.createdAt, "")
        );

        homeBlogContainer.prepend(card);
    });
}


/* ===== DASHBOARD: SHOW, EDIT AND DELETE BLOGS ===== */

const dashboardBlogList = document.getElementById("dynamicDashboardBlogs");

if (dashboardBlogList) {
    function renderDashboardBlogs() {
        const blogs = getBlogs();

        const totalCount = document.getElementById("totalBlogsCount");
        const publishedCount = document.getElementById("publishedBlogsCount");
        const draftCount = document.getElementById("draftBlogsCount");

        if (totalCount) totalCount.textContent = blogs.length;

        if (publishedCount) {
            publishedCount.textContent = blogs.filter(
                blog => blog.status === "published"
            ).length;
        }

        if (draftCount) {
            draftCount.textContent = blogs.filter(
                blog => blog.status === "draft"
            ).length;
        }

        dashboardBlogList.replaceChildren();

        if (blogs.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 4;
            cell.textContent = "No blogs yet. Create your first blog!";
            row.appendChild(cell);
            dashboardBlogList.appendChild(row);
            return;
        }

        blogs.forEach(blog => {
            const row = document.createElement("tr");

            row.appendChild(createTextElement("td", blog.title, ""));
            row.appendChild(createTextElement("td", blog.category, ""));

            const statusCell = document.createElement("td");
            const status = document.createElement("span");

            status.className = blog.status === "published"
                ? "status published"
                : "status draft";

            status.textContent = blog.status === "published"
                ? "Published"
                : "Draft";

            statusCell.appendChild(status);
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");

            const editLink = document.createElement("a");
            editLink.href =
                "create-blog.html?edit=" + encodeURIComponent(blog.id);
            editLink.className = "text-link";
            editLink.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-blog-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                const confirmed = window.confirm(
                    'Are you sure you want to delete "' +
                    blog.title + '"?'
                );

                if (!confirmed) return;

                const updatedBlogs = getBlogs().filter(
                    item => item.id !== blog.id
                );

                saveBlogs(updatedBlogs);
                renderDashboardBlogs();
            });

            actionCell.append(editLink, deleteButton);
            row.appendChild(actionCell);

            dashboardBlogList.appendChild(row);
        });
    }

    renderDashboardBlogs();
}


/* ===== BLOG DETAILS PAGE ===== */

const blogDetailsContainer = document.getElementById("blogDetails");

if (blogDetailsContainer) {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    let savedBlogs = [];

    try {
        savedBlogs = JSON.parse(
            localStorage.getItem("blogSpaceBlogs")
        ) || [];
    } catch (error) {
        savedBlogs = [];
    }

    const blog = savedBlogs.find(
        item => item.id === blogId &&
                item.status === "published"
    );

    if (!blog) {
        blogDetailsContainer.replaceChildren();

        const message = document.createElement("div");
        message.className = "blog-not-found";

        const heading = document.createElement("h2");
        heading.textContent = "Blog Not Found";

        const paragraph = document.createElement("p");
        paragraph.textContent =
            "This blog may not exist or has not been published.";

        const link = document.createElement("a");
        link.href = "index.html#blogs";
        link.className = "btn";
        link.textContent = "Explore Blogs";

        message.append(heading, paragraph, link);
        blogDetailsContainer.appendChild(message);
    } else {
        blogDetailsContainer.replaceChildren();

        if (blog.image) {
            try {
                const imageUrl = new URL(blog.image);

                if (
                    imageUrl.protocol === "https:" ||
                    imageUrl.protocol === "http:"
                ) {
                    const image = document.createElement("img");
                    image.src = imageUrl.href;
                    image.alt = blog.title;
                    image.className = "blog-details-image";
                    image.loading = "lazy";

                    image.addEventListener("error", function () {
                        image.remove();
                    });

                    blogDetailsContainer.appendChild(image);
                }
            } catch (error) {
                // Skip an invalid image URL.
            }
        }

        const category = document.createElement("span");
        category.className = "blog-details-category";
        category.textContent = blog.category;

        const title = document.createElement("h1");
        title.textContent = blog.title;

        const meta = document.createElement("p");
        meta.className = "blog-details-meta";
        meta.textContent = "Published on " + (blog.createdAt || "Unknown date");

        const content = document.createElement("div");
        content.className = "blog-details-content";
        content.textContent = blog.content;

        blogDetailsContainer.append(
            category,
            title,
            meta,
            content
        );
    }
}

