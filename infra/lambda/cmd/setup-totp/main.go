package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager/types"
	"github.com/tsabunkar/admin/internal/secrets"
	"github.com/tsabunkar/admin/internal/totp"
)

type totpSecret struct {
	Secret string `json:"secret"`
}

type statusResponse struct {
	Configured      bool   `json:"configured"`
	ProvisioningURI string `json:"provisioning_uri,omitempty"`
}

type generateResponse struct {
	ProvisioningURI string `json:"provisioning_uri"`
	Secret          string `json:"secret"`
}

type errorResponse struct {
	Error string `json:"error"`
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

func handler(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	switch request.RequestContext.HTTP.Method {
	case "GET":
		return handleGet(ctx)
	case "POST":
		return handleGenerate(ctx)
	default:
		return respond(http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
	}
}

func handleGet(ctx context.Context) (events.APIGatewayV2HTTPResponse, error) {
	var sec totpSecret
	err := secretsClient.GetJSON(ctx, "/admin/totp-secret", &sec)
	if err != nil {
		var notFound *types.ResourceNotFoundException
		if errors.As(err, &notFound) {
			return respond(http.StatusOK, statusResponse{Configured: false})
		}
		return respond(http.StatusInternalServerError, errorResponse{Error: "internal error"})
	}
	if sec.Secret == "" {
		return respond(http.StatusOK, statusResponse{Configured: false})
	}
	uri := totp.ProvisioningURI(sec.Secret, "tsabunkar", "Portfolio Admin")
	return respond(http.StatusOK, statusResponse{
		Configured:      true,
		ProvisioningURI: uri,
	})
}

func handleGenerate(ctx context.Context) (events.APIGatewayV2HTTPResponse, error) {
	secret, uri, err := totp.GenerateSecret("tsabunkar", "Portfolio Admin")
	if err != nil {
		return respond(http.StatusInternalServerError, errorResponse{Error: "failed to generate secret"})
	}

	if err := secretsClient.PutJSON(ctx, "/admin/totp-secret", totpSecret{Secret: secret}); err != nil {
		return respond(http.StatusInternalServerError, errorResponse{Error: "failed to save secret"})
	}

	return respond(http.StatusOK, generateResponse{
		ProvisioningURI: uri,
		Secret:          secret,
	})
}

func respond(status int, body interface{}) (events.APIGatewayV2HTTPResponse, error) {
	b, _ := json.Marshal(body)
	return events.APIGatewayV2HTTPResponse{
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
