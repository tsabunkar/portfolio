package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/tsabunkar/admin/internal/jwt"
	"github.com/tsabunkar/admin/internal/secrets"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type loginResponse struct {
	Token string `json:"token"`
}

type credentialsSecret struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type jwtSecret struct {
	Secret string `json:"secret"`
}

var secretsClient *secrets.Client

func init() {
	ctx := context.Background()
	var err error
	secretsClient, err = secrets.New(ctx)
	if err != nil {
		panic("failed to init secrets client: " + err.Error())
	}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req loginRequest
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return respond(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}
	if req.Username == "" || req.Password == "" {
		return respond(http.StatusBadRequest, map[string]string{"error": "username and password required"})
	}

	var creds credentialsSecret
	if err := secretsClient.GetJSON(ctx, "/admin/credentials", &creds); err != nil {
		return respond(http.StatusInternalServerError, map[string]string{"error": "internal error"})
	}

	if req.Username != creds.Username || req.Password != creds.Password {
		return respond(http.StatusUnauthorized, map[string]string{"error": "invalid credentials"})
	}

	var jwtSec jwtSecret
	if err := secretsClient.GetJSON(ctx, "/admin/jwt-secret", &jwtSec); err != nil {
		return respond(http.StatusInternalServerError, map[string]string{"error": "internal error"})
	}

	token, err := jwt.Sign(jwtSec.Secret, req.Username, time.Hour)
	if err != nil {
		return respond(http.StatusInternalServerError, map[string]string{"error": "internal error"})
	}

	return respond(http.StatusOK, loginResponse{Token: token})
}

func respond(status int, body interface{}) (events.APIGatewayProxyResponse, error) {
	b, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "https://tsabunkar.com",
		},
		Body: string(b),
	}, nil
}

func main() {
	lambda.Start(handler)
}
