package secrets

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

type Client struct {
	sm *secretsmanager.Client
}

func New(ctx context.Context) (*Client, error) {
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return nil, err
	}
	return &Client{sm: secretsmanager.NewFromConfig(cfg)}, nil
}

func (c *Client) GetJSON(ctx context.Context, secretID string, dest interface{}) error {
	out, err := c.sm.GetSecretValue(ctx, &secretsmanager.GetSecretValueInput{
		SecretId: &secretID,
	})
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(*out.SecretString), dest)
}

func (c *Client) PutJSON(ctx context.Context, secretID string, value interface{}) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}
	s := string(b)

	_, err = c.sm.PutSecretValue(ctx, &secretsmanager.PutSecretValueInput{
		SecretId:     &secretID,
		SecretString: &s,
	})
	return err
}
