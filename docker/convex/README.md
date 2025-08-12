https://github.com/get-convex/convex-backend/blob/main/self-hosted/README.md

Your Convex backend will be running on this server at port 3210, with HTTP actions exposed at port 3211, and the dashboard running on port 6791.

Set up routing to forward requests from your domain to these ports. For example:

- https://api.my-domain.com forwards to http://localhost:3210
- https://my-domain.com forwards to http://localhost:3211
- https://dashboard.my-domain.com forwards to http://localhost:6791

In a `.env` file beside the docker-compose.yml file, set the following environment variables:

```
# URL of the Convex API as accessed by the client/frontend.
CONVEX_CLOUD_ORIGIN='https://api.my-domain.com'

# URL of Convex HTTP actions as accessed by the client/frontend.
CONVEX_SITE_ORIGIN='https://my-domain.com'

# URL of the Convex API as accessed by the dashboard (browser).
NEXT_PUBLIC_DEPLOYMENT_URL='https://api.my-domain.com'
```

Summary:

- Port 3210:
  - Chức năng:
    - Convex API chính - xử lý tất cả database operations
    - Real-time subscriptions - cho live updates
    - Function calls - gọi các Convex functions
    - Authentication - xử lý auth
    - Database queries - read/write data
  - Sử dụng:
    - Frontend kết nối để gọi functions
    - Real-time subscriptions
      -Database operations

- Port 3211:
  - Chức năng:
    - HTTP Actions - cho webhooks và external API calls
    - Site hosting - serve static files
    - Proxy requests - forward requests đến external services
    - Webhook endpoints - nhận webhooks từ bên ngoài
  - Sử dụng:
    - Webhooks từ Stripe, GitHub, etc.
    - External API integrations
    - Static file serving
    - Server-side rendering
