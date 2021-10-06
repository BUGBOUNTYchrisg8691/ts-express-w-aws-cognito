import AWS from "aws-sdk";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

class CognitoService {
  private config = {
    region: "us-east-1",
  };
  private clientSecret: string = process.env.APP_CLIENT_SECRET;
  private clientId: string = process.env.APP_CLIENT_ID;

  private cognitoIdentity;
  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(
    username: string,
    password: string,
    userAttr: Array<any>
  ): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      SecretHash: this.generateHash(username),
      UserAttributes: userAttr,
    };

    try {
      const data = await this.cognitoIdentity.signUp(params).promise();
      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }

  public async verifyAccount(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      SecretHash: this.generateHash(username),
      Username: username,
    };

    try {
      const data = await this.cognitoIdentity.confirmSignUp(params).promise();
      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }

  public async signInUser(
    username: string,
    password: string
  ): Promise<boolean> {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: this.generateHash(username),
      },
    };

    try {
      let data = await this.cognitoIdentity.initiateAuth(params).promise();
      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }

  private generateHash(username: string): string {
    return crypto
      .createHmac("SHA256", this.clientSecret)
      .update(username + this.clientId)
      .digest("base64");
  }
}

export default CognitoService;
