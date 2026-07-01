package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/tsabunkar/admin/internal/secrets"
)

type gitHubTokenSecret struct {
	Token string `json:"token"`
}

type graphQLRequest struct {
	Query     string `json:"query"`
	Variables map[string]string `json:"variables"`
}

var secretsClient *secrets.Client
var githubToken string
var httpClient *http.Client

func init() {
	ctx := context.Background()
	var err error
	secretsClient, err = secrets.New(ctx)
	if err != nil {
		panic("failed to init secrets client: " + err.Error())
	}

	var ghSecret gitHubTokenSecret
	if err := secretsClient.GetJSON(ctx, "/admin/github-token", &ghSecret); err != nil {
		panic("failed to read github token: " + err.Error())
	}
	githubToken = ghSecret.Token

	httpClient = &http.Client{}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	username := os.Getenv("GITHUB_USERNAME")
	if username == "" {
		username = "tsabunkar"
	}

	query := `
		query($username: String!) {
			user(login: $username) {
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
							}
						}
					}
				}
			}
		}`

	body := graphQLRequest{
		Query: query,
		Variables: map[string]string{
			"username": username,
		},
	}

	payload, _ := json.Marshal(body)

	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.github.com/graphql",
		bytes.NewReader(payload))
	if err != nil {
		return respond(500, map[string]string{"error": "internal error"})
	}

	req.Header.Set("Authorization", "Bearer "+githubToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return respond(502, map[string]string{"error": fmt.Sprintf("github api error: %v", err)})
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	var result interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return respond(502, map[string]string{"error": "invalid github response"})
	}

	return respond(resp.StatusCode, result)
}

func respond(status int, body interface{}) (events.APIGatewayProxyResponse, error) {
	b, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "https://tsabunkar.com",
			"Access-Control-Allow-Headers": "Authorization,Content-Type",
		},
		Body: string(b),
	}, nil
}

func main() {
	lambda.Start(handler)
}
