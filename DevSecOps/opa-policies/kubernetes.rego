package kubernetes

# Kubernetes-specific security policies for IAM Dashboard
# These policies focus on Kubernetes resource security

# Deny if pod runs as root
deny[msg] {
    input.resource_type == "Pod"
    input.resource.spec.securityContext.runAsUser == 0
    msg := "Pod should not run as root user"
}

# Deny if pod doesn't have security context
deny[msg] {
    input.resource_type == "Pod"
    not input.resource.spec.securityContext
    msg := "Pod must have security context defined"
}

# Deny if pod allows privilege escalation
deny[msg] {
    input.resource_type == "Pod"
    input.resource.spec.containers[_].securityContext.allowPrivilegeEscalation == true
    msg := "Pod should not allow privilege escalation"
}

# Deny if pod runs in privileged mode
deny[msg] {
    input.resource_type == "Pod"
    input.resource.spec.containers[_].securityContext.privileged == true
    msg := "Pod should not run in privileged mode"
}

# Deny if service account has default token
deny[msg] {
    input.resource_type == "ServiceAccount"
    input.resource.automountServiceAccountToken == true
    msg := "Service account should not automatically mount default token"
}

# Allow if all Kubernetes security checks pass
allow {
    count(deny) == 0
}


