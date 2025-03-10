import * as cdk from 'aws-cdk-lib';
import * as apig from "aws-cdk-lib/aws-apigateway";


import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
   //... other lambda functions ...

   const newMovieFn = new lambdanode.NodejsFunction(this, "AddMovieFn", {
    architecture: lambda.Architecture.ARM_64,
    runtime: lambda.Runtime.NODEJS_22_X,
    entry: `${__dirname}/../lambdas/addMovie.ts`,
    timeout: cdk.Duration.seconds(10),
    memorySize: 128,
    environment: {
      TABLE_NAME: moviesTable.tableName,
      REGION: "eu-west-1",
    },
  });


export class ServerlessRestLabStack extends cdk.Stack {
      // Permissions
      ..... as before ....
      // REST API 
      const api = new apig.RestApi(this, "RestAPI", {
        description: "demo api",
        deployOptions: {
          stageName: "dev",
        },
        defaultCorsPreflightOptions: {
          allowHeaders: ["Content-Type", "X-Amz-Date"],
          allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
          allowCredentials: true,
          allowOrigins: ["*"],
        },
      });
  
      // Movies endpoint
      const moviesEndpoint = api.root.addResource("movies");
      moviesEndpoint.addMethod(
        "GET",
        new apig.LambdaIntegration(getAllMoviesFn, { proxy: true })
      );
      // Detail movie endpoint
      const specificMovieEndpoint = moviesEndpoint.addResource("{movieId}");
      specificMovieEndpoint.addMethod(
        "GET",
        new apig.LambdaIntegration(getMovieByIdFn, { proxy: true })
      );
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ServerlessRestLabQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
