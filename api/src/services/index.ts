import { Application } from "../declarations";
import ariesAgent from "./aries-agent/aries-agent.service";
import connection from "./connection/connection.service";
import credentialExchange from "./credential-exchange/credential-exchange.service";
import issuerInvite from "./issuer-invite/issuer-invite.service";
import mailer from "./mailer/mailer.service";
import webhooks from "./webhooks/webhooks.service";
import tokenValidation from "./token-validation/token-validation.service";
import connectionRecord from "./connection-record/connection-record.service";
import proof from "./proof/proof.service";
import revocationRegistry from "./revocation-registry/revocation-registry.service";
import user from "./user/user.service";
// Don't remove this comment. It's needed to format import lines nicely.

export function services(app: Application) {
  app.configure(issuerInvite);
  app.configure(connection);
  app.configure(credentialExchange);
  app.configure(webhooks);
  app.configure(tokenValidation);
  app.configure(connectionRecord);
  app.configure(proof);
  app.configure(revocationRegistry);
  app.configure(user);
}

export function internalServices(app: Application) {
  app.configure(mailer);
  app.configure(ariesAgent);
}