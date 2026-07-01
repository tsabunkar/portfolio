package main

import (
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/tsabunkar/admin/internal/jwt"
	"github.com/tsabunkar/admin/internal/secrets"
)

type jwtSecret struct {
	Secret string `json:"secret"`
}

var secretsClient *secrets.Client
var jwtSecretKey string

func init() {
	ctx := context.Background()
	var err error
	secretsClient, err = secrets.New(ctx)
	if err != nil {
		panic("failed to init secrets client: " + err.Error())
	}

	var sec jwtSecret
	if err := secretsClient.GetJSON(ctx, "/admin/jwt-secret", &sec); err != nil {
		panic("failed to read jwt secret: " + err.Error())
	}
	jwtSecretKey = sec.Secret
}

func handler(ctx context.Context, event events.APIGatewayCustomAuthorizerRequestTypeRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	tokenStr := event.Headers["authorization"]
	if tokenStr == "" {
		tokenStr = event.Headers["Authorization"]
	}
	tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

	if tokenStr == "" {
		return deny("Unauthorized"), nil
	}

	claims, err := jwt.Verify(jwtSecretKey, tokenStr)
	if err != nil {
		return deny("Unauthorized"), nil
	}

	return allow(event.MethodArn, claims.Username), nil
}

func allow(methodArn, principal string) events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: principal,
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Allow",
					Resource: []string{methodArn},
				},
			},
		},
		Context: map[string]interface{}{
			"username": principal,
		},
	}
}

func deny(msg string) events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "user",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Deny",
					Resource: []string{"*"},
				},
			},
		},
	}
}

func main() {
	lambda.Start(handler)
}
