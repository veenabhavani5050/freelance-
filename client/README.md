client\src\components\Footer.jsx
client\src\components\ContractCard.jsx
client\src\components\Layout.jsx
client\src\components\Loader.jsx
client\src\components\ProtectedRoute.jsx
client\src\components\PublicLayout.jsx
client\src\components\ServiceCard.jsx
client\src\components\Sidebar.jsx
client\src\components\Topbar.jsx
client\src\context\UserContext.jsx
client\src\pages\ClientDashboard.jsx
client\src\pages\ClientJobDetails.jsx
client\src\pages\ClientJobs.jsx
client\src\pages\ClientPayments.jsx
client\src\pages\ContractDetails.jsx
client\src\pages\Contracts.jsx
client\src\pages\CreateContract.jsx
client\src\pages\CreateProposal.jsx
client\src\components\ContractCard.jsx
client\src\pages\CreateService.jsx
client\src\pages\EditContract.jsx
client\src\pages\Dashboard.jsx
client\src\pages\EditJob.jsx
client\src\pages\EditService.jsx
client\src\pages\ForgotPassword.jsx
client\src\pages\FreelancerDashboard.jsx
client\src\pages\FreelancerEarnings.jsx
client\src\pages\FreelancerJobs.jsx
client\src\pages\FreelancerProposals.jsx
client\src\pages\FreelancerReviews.jsx
client\src\pages\Freelancers.jsx
client\src\pages\FreelancerServices.jsx
client\src\pages\FreelancersList.jsx
client\src\pages\Home.jsx
client\src\pages\JobDetails.jsx
client\src\pages\JobsList.jsx
client\src\pages\Login.jsx
client\src\pages\NotFound.jsx
client\src\pages\PostJob.jsx
client\src\pages\Profile.jsx
client\src\pages\Register.jsx
client\src\pages\ResetPassword.jsx
client\src\pages\ServiceDetail.jsx
client\src\pages\Services.jsx
client\src\App.jsx
client\src\main.jsx





api\config\db.js
api\config\passport.js
api\controllers\authController.js
api\controllers\contractController.js
api\controllers\jobController.js
api\controllers\reviewController.js
api\controllers\serviceController.js
api\controllers\userController.js
api/controllers/paymentController.js
api\middleware\authMiddleware.js
api\middleware\errorMiddleware.js
api\middleware\uploadMiddleware.js
api\middleware\validationMiddleware.js
api\models\Contract.js
api\models\Job.js
api/models/Notification.js
api\models\Service.js
api\models\Review.js
api\models\User.js
api\routes\authRoutes.js
api\routes\contractRoutes.js
api\routes\jobRoutes.js
api\routes\reviewRoutes.js
api\routes\serviceRoutes.js
api\routes\userRoutes.js
api/routes/paymentRoutes.js
api/routes/notificationRoutes.js
api\utils\generateToken.js
api\utils\jwt.js
api\utils\googleVerifyToken.js
api\utils\sendEmail.js
api\app.js
api\server.js



Backend (API)

api\controllers\authController.js – test all auth endpoints (register, login, logout, password reset).

api\routes\authRoutes.js – verify correct route mapping and middleware usage.

api\models\User.js – confirm schema fields match requirements (role, email, password).

api\utils\generateToken.js – ensure token generation works with JWT.

api\utils\googleVerifyToken.js – test only if Google login is enabled.

api\middleware\authMiddleware.js – confirm token validation and role restrictions.

api\utils\sendEmail.js – test password reset email flow.

Frontend (Client)

client\src\pages\Register.jsx

client\src\pages\Login.jsx

client\src\pages\ForgotPassword.jsx

client\src\pages\ResetPassword.jsx

client\src\components\ProtectedRoute.jsx – verify route protection.

client\src\pages\Profile.jsx – test profile updates.

2. Job Management Module
Once auth is confirmed, test job creation, update, list, and view.

Backend

api\controllers\jobController.js

api\routes\jobRoutes.js

api\models\Job.js

Frontend

client\src\pages\PostJob.jsx – create job.

client\src\pages\EditJob.jsx – edit job.

client\src\pages\ClientJobs.jsx – list jobs.

client\src\pages\ClientJobDetails.jsx – view job details.

3. Service Management Module
For freelancer-created service listings, test CRUD operations.

Backend

api\controllers\serviceController.js

api\routes\serviceRoutes.js

api\models\Service.js

Frontend

client\src\pages\CreateService.jsx – create service.

client\src\pages\EditService.jsx – edit service.

client\src\pages\Services.jsx – list all services.

client\src\pages\ServiceDetail.jsx – view service detail.

client\src\components\ServiceCard.jsx – check rendering.

client\src\pages\FreelancerServices.jsx – freelancer’s own services.

4. Contract Management Module
Test creation, milestone tracking, and completion flow.

Backend

api\controllers\contractController.js

api\routes\contractRoutes.js

api\models\Contract.js

Frontend

client\src\pages\CreateContract.jsx – create contract.

client\src\pages\EditContract.jsx – edit contract.

client\src\pages\Contracts.jsx – view list of contracts.

client\src\pages\ContractDetails.jsx – contract detail view.

client\src\components\ContractCard.jsx – contract display.

5. Shared Components & Layout
These should be tested after main features to ensure navigation and UI are correct.

Frontend

client\src\components\Footer.jsx

client\src\components\Layout.jsx

client\src\components\PublicLayout.jsx

client\src\components\Sidebar.jsx

client\src\components\Topbar.jsx

client\src\components\Loader.jsx

6. Dashboards
Verify data aggregation and role-based display.

Frontend

client\src\pages\Dashboard.jsx – general overview.

client\src\pages\ClientDashboard.jsx – client-specific.

client\src\pages\FreelancerDashboard.jsx – freelancer-specific.

client\src\pages\Freelancers.jsx & client\src\pages\FreelancersList.jsx – listing freelancers.

7. System & Utility Layer
Finally, check system-level files to ensure the app runs properly.

Backend

api\config\db.js – DB connection test.

api\config\passport.js – if using Passport for social login.

api\middleware\errorMiddleware.js – error handling.

api\middleware\uploadMiddleware.js – file uploads.

api\middleware\validationMiddleware.js – request validation.

api\app.js – express setup.

api\server.js – server startup.

Frontend

client\src\App.jsx – routing test.

client\src\main.jsx – React entry point.

client\src\pages\NotFound.jsx – fallback route.

client\src\pages\Home.jsx – landing page.