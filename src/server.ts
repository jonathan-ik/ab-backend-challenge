import { App } from "./app";
import { AuthRoute } from "./routes/auth.route";
import { UserRoute } from "./routes/user.route";
import { RelationshipRoute } from "./routes/relationship.route";

const app = new App([new AuthRoute(), new UserRoute(), new RelationshipRoute()]);
app.listen()