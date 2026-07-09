package totp

import (
	"github.com/pquerna/otp/totp"
)

func GenerateSecret(accountName, issuer string) (string, string, error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      issuer,
		AccountName: accountName,
	})
	if err != nil {
		return "", "", err
	}
	return key.Secret(), key.URL(), nil
}

func ValidateCode(secret, code string) bool {
	return totp.Validate(code, secret)
}

func ProvisioningURI(secret, accountName, issuer string) string {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      issuer,
		AccountName: accountName,
		Secret:      []byte(secret),
	})
	if err != nil {
		return ""
	}
	return key.URL()
}
