---
layout: post
title: Getting Started With Kubernetes
tags: [kubernetes, cheatsheet]
cover:
    alt: Wikipedia page header of Kubernetes
    hidden: false
resources:
  - name: cover
    src: cover.png
date: 2022-11-19
---

So you've joined a new project as a developer, and that project uses Kubernetes.
Everyone around you uses terms like `pods`, `deployments` and `configmaps` and you don't really know what they mean.
Let me help you get started.

<!--more-->

I'd like to give you a high level overview and basic commands to get started. 
I try to be understandable rather than deep technical, there's a lot of ground to cover.

I use it in my day to day job, I have enough knowledge to get by, but might not always know the latest nuances.
I'd like to share some snippets to get you started.

For every component I'll link the official documents that contain the latest information,
you should always trust the official sources more than random blog posts.

## What is Kubernetes

Kubernetes (often abbreviated as k8s - 8 letters between 'k' and 's') is a container orchestration platform.
If you've used Docker to run containers locally, Kubernetes helps you manage those containers in production at scale.

Think of it as an automation system that handles:

- Running your containers across multiple machines
- Automatically restarting failed containers
- Scaling your application up and down based on load
- Load balancing traffic between containers
- Rolling out updates without downtime

Originally developed by Google and now maintained by the Cloud Native Computing Foundation,
it's become the de facto standard for deploying containerized applications.

The learning curve can be steep, but once you grasp the basics you'll see why it's so widely adopted.

## Useful Resources

- [Official docs](https://kubernetes.io/)
- [Kubernetes GitHub](https://github.com/kubernetes)
- [Kubernetes Comic](https://cloud.google.com/kubernetes-engine/kubernetes-comic)

### How can I try it out

The easiest way to get started is to use a local Kubernetes cluster.
Here are some popular options:

#### Docker Desktop

If you're using Docker Desktop (available for Mac and Windows), it comes with Kubernetes built-in.

1. Open Docker Desktop preferences/settings
2. Go to the Kubernetes tab
3. Check "Enable Kubernetes"
4. Click "Apply & Restart"

It takes a few minutes to download and start up, but then you'll have a fully functional single-node cluster.

#### Minikube

[Minikube](https://minikube.sigs.k8s.io/docs/start/) is another popular option that runs a local Kubernetes cluster.

```bash
# Install minikube (on macOS)
brew install minikube

# Start the cluster
minikube start

# Check the status
minikube status
```

#### k3s/k3d

If you want something lightweight, [k3s](https://k3s.io/) is a minimal Kubernetes distribution,
and [k3d](https://k3d.io/) makes it easy to run k3s in Docker.

```bash
# Install k3d (on macOS)
brew install k3d

# Create a cluster
k3d cluster create my-cluster

# List clusters
k3d cluster list
```

Once you have any of these running, you can use `kubectl` to interact with your cluster.

Note: Throughout Kubernetes documentation and commands, you'll often see `k8s` used as an abbreviation for Kubernetes.

### kubectl

[kubectl](https://kubernetes.io/docs/reference/kubectl/) is the command-line tool for interacting with Kubernetes clusters.
It's your main interface for deploying applications, inspecting resources, and debugging issues.

First, create an alias to save some keystrokes:

```bash
alias k=kubectl
```

Here are the most common commands you'll use:

#### get

Lists resources in your cluster.

```bash
k get pods                    # List all pods in current namespace
k get pods --all-namespaces   # List pods across all namespaces
k get deployments             # List deployments
k get services                # List services
k get nodes                   # List cluster nodes
```

#### apply

Creates or updates resources from a configuration file.

```bash
k apply -f deployment.yaml    # Apply a single file
k apply -f ./configs/         # Apply all files in a directory
```

#### describe

Shows detailed information about a resource, including events.

```bash
k describe pod my-pod-name
k describe deployment my-deployment
k describe node node-name
```

This is super useful for debugging, as it shows you why a pod might be failing to start.

#### port-forward

Forwards a local port to a port on a pod, useful for accessing services locally.

```bash
k port-forward pod/my-pod 8080:80     # Forward local 8080 to pod's port 80
k port-forward service/my-service 8080:80
```

#### scale

Changes the number of replicas for a deployment.

```bash
k scale deployment my-deployment --replicas=3    # Scale to 3 pods
k scale deployment my-deployment --replicas=0    # Scale down to 0 (stop all pods)
```

#### delete

Removes resources from the cluster.

```bash
k delete pod my-pod
k delete deployment my-deployment
k delete -f deployment.yaml   # Delete resources defined in file
```

#### cp

Copies files between your local machine and pods.

```bash
k cp my-pod:/path/to/file ./local-file      # Copy from pod to local
k cp ./local-file my-pod:/path/to/file      # Copy from local to pod
```

#### create

Creates resources from command line arguments or files.

```bash
k create deployment my-app --image=nginx:latest
k create configmap my-config --from-file=config.json
```

#### run

Quickly runs a pod for testing or debugging.

```bash
k run test-pod --image=busybox --rm -it -- sh   # Run interactive shell
k run nginx --image=nginx                        # Run nginx pod
```

#### label

Adds or updates labels on resources.

```bash
k label pod my-pod environment=production
k label pod my-pod version=v1.2.3 --overwrite
```

If you're using `oh-my-zsh`, the kubectl plugin provides many helpful aliases like `kgp` for `kubectl get pods` and `kgpw` for `kubectl get pods --watch`.

## Building Blocks

Here I'll list the basic building blocks that you should be familiar with.

In the image below the arrows indicate a `creates a` relationship.
So for example if you look at the [Deployment](#deployment)
it will _create a_ ReplicaSet, and that will _create a_ [Pod](#pod).

{{< imagetheme
    alt="Building blocks"
    darksrc="blocks-dark.png"
    lightsrc="blocks-light.png"
>}}

You can use these building blocks to build your applications.

You need to name your resources and add [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
to them if you need to connect to outer networks via [Services](#service).

### Pod

[Official Docs](https://kubernetes.io/docs/concepts/workloads/pods/)

This is the smallest unit. Since kubernetes is a container orchestrator service,
you can guess that this block is responsible for defining which container to use, and with what parameters.

Even this can be composed of multiple containers if they should always be treated as a whole.
A sidecar container is a commonly used expression that refers to containers that are joined alongside the main pods.
Keep in mind though that a pod lives until any of its containers live...
So, choose your sidecars wisely, that it won't hide the failures of the main pod.

Just briefly pod is alive if its underlying container is running its single task without error or termination.

You rarely need to create a pod by itself in a definition,
since if it dies nothing will make sure that it will start up again, like a [Deployment](#deployment).

But it's useful for investigating network issues or inspecting files from a shared volume.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: pvc-inspector
spec:
  containers:
  - image: busybox
    name: pvc-inspector
    command: ["tail"]
    args: ["-f", "/dev/null"]
    volumeMounts:
    - mountPath: /pvc
      name: pvc-mount
  volumes:
  - name: pvc-mount
    persistentVolumeClaim:
      claimName: investigable-pv-claim
EOF
```

```bash
k get pods --watch
# oh-my-zsh alias:
kgpw
```

### Job

[Docs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

If you need to run a single task that has a clearly defined end, and it's not supposed to run indefinitely you can create a Job.

Here's a basic definition:

```yml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: busybox:latest
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

```bash
k get jobs
```

#### CronJob

[Docs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)

If you need to run a specific task repeatedly you can define a CronJob.
As its name suggests you can schedule your task with a time definition format used by the
[cron](https://en.wikipedia.org/wiki/Cron) command line utility.

[Crobtab.guru](https://crontab.guru/) is a helpful tool for understanding when is the next schedule.

### Deployment

[Docs](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

This is the most common way to deploy your applications.
It creates ReplicaSets under the hood that handle the pod creation.
It provides auto restart and scaling.

```bash
k get deployment
k scale deployment $DEPLOYMENT_NAME --replicas=0 # scale down, kill pods
```

## Configuration

Now that your application is built up you might want to change some variable parts in your containers.

### Environment Variables

Most likely if you follow the [12Factor App](https://12factor.net/) principles you're familiar with Environment Variables in general.

The simplest way is to use the `env` list param of the container specification:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-env-variable
spec:
  containers:
    - name: pod-with-env-variable
      command:
        - sh
        - -c
      args:
        - sleep $SLEEP_TIME_SECONDS;
      image: busybox:1.28
      env:
        - name: SLEEP_TIME_SECONDS
          value: "3600"
```

### ConfigMap

[Docs](https://kubernetes.io/docs/concepts/configuration/configmap/)

You can use so called ConfigMap-s to get multiple values into the environment variables with the `valueFrom.configMapKeyRef` parameter.

```yml
env:
- name: SLEEP_TIME_SECONDS
  valueFrom:
    configMapKeyRef:
      name: configmap-name
      key: key_in_configmap
```

ConfigMaps can do more than setting environment values, they can store files, and override local files upon container creation.
You need to attach the ConfigMap as a volume, and load its data in the needed containers.

```yml
apiVersion: batch/v1
kind: Job
metadata:
  name: load-001
spec:
  template:
    spec:
      containers:
      - name: load-container
        image: my-custom-image:1.2.3
        command: ["/bin/bash"]
        args: ["/load/run.sh"]
        volumeMounts:
        - mountPath: /load
          name: load-script-volume
      volumes:
      - name: load-script-volume
        configMap:
          name: load-script
      restartPolicy: Never
  backoffLimit: 1
```

```bash
# see what a configmap yml would look like if it was created from literal value and 2 files
kubectl create configmap load-script \
  --from-literal key1=VALUE_1 \
  --from-file=./run.sh \
  --from-file=./import.sql \
  -o yaml --dry-run=client | less
```

### Secret

[Docs](https://kubernetes.io/docs/concepts/configuration/secret/)

Although its name suggests it's a secret, note that the values by default are only base64 encoded,
they can be decoded simply if you have API access or can add a custom pod. 
For better security see the [Secret Best Practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices).

Just like with ConfigMaps Secrets can be used in environment variable values.
One way is to set them one by one with `env.valueFrom.secretKeyRef`,
also you can consume all values at once with `envFrom.secretRef`.

```yml
env:
  - name: SECRET_PASSWORD
    valueFrom:
      secretKeyRef:
        name: my-secret
        key: password
envFrom:
  - secretRef:
      name: db-credentials
```

Also Secrets can be mounted as volumes.

```yml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
spec:
  containers:
  - name: my-container
    image: busybox:latest
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-mounted"
  volumes:
  - name: secret-volume
    secret:
      secretName: my-secret
```

```bash
# see what a secret yml would look like if it was created from literal value and 2 files
kubectl create secret generic db-credentials \
  --from-literal USERNAME=user \
  --from-file=./key.pem \
  --from-file=./password.txt \
  -o yaml --dry-run=client | less
# alias to decode secrets
alias ksecret='f() { SECRET_NAME="$1"; k get secret $SECRET_NAME -o json | jq -r ".data | map_values(@base64d)" }; f'
```

## Networking

Kubernetes networking can be confusing. Kubernetes uses internal DNS, so that pods can communicate with each other.
Kubernetes assigns IP addresses to each pods, and the service names are added as environment variables.
It has internal DNS to resolve service names.

### Service

[Official Docs](https://kubernetes.io/docs/concepts/services-networking/service/)

Services provide a stable way to access your pods.
Since pods can be created and destroyed dynamically, their IP addresses change.
Services give you a consistent DNS name and IP address to reach your application.

Services use label selectors to determine which pods to route traffic to.

#### Port vs TargetPort

- **targetPort**: The port inside the container where your application is listening
- **port**: The port that the service exposes to other services in the cluster

In the example below `my-service:8080` will be routed to the `:1313` port inside the container.

```yml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - name: http
      port: 8080
      protocol: TCP
      targetPort: 1313
```

#### Service Types

Services can be exposed in different ways depending on where you need to access them from.

##### ClusterIP

The default type. The service is only accessible from within the cluster.

```yml
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: 8080
```

This is what you'll use for internal services that don't need external access,
like a database or an internal API.

##### NodePort

Exposes the service on each node's IP at a static port (30000-32767 range by default).

```yml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```

You can then access the service at `<NodeIP>:30080` from outside the cluster.
This is useful for development, but not recommended for production.

##### LoadBalancer

Creates an external load balancer (if your cluster runs on a cloud provider that supports it).

```yml
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8080
```

The cloud provider assigns an external IP address, and traffic is distributed across your pods.
This is commonly used in production for services that need to be publicly accessible.

```bash
k get services
# NAME         TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
# my-service   LoadBalancer   10.0.171.239    52.167.89.123   80:31234/TCP   2m
```

### Ingress

[Docs](https://kubernetes.io/docs/concepts/services-networking/ingress/)

While Services expose your application, Ingress manages external access to your services,
typically HTTP and HTTPS traffic.
Think of it as a smart router that sits in front of your services.

Ingress can provide:

- URL-based routing (different paths go to different services)
- Host-based routing (different domains go to different services)
- SSL/TLS termination
- Load balancing

Here's a simple example that routes traffic based on the path:

```yml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /web
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

In this example, traffic to `myapp.example.com/api` goes to `api-service`,
while traffic to `myapp.example.com/web` goes to `web-service`.

Note that Ingress requires an Ingress Controller to work (like nginx-ingress, traefik, or others).
Most managed Kubernetes services come with one pre-installed.

## Storage

[Docs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

By default, data in containers is ephemeral - it disappears when the container stops.
For stateful applications like databases, you need persistent storage.

Kubernetes provides a storage abstraction through Volumes, PersistentVolumes (PV), and PersistentVolumeClaims (PVC).

### PersistentVolume (PV)

A PersistentVolume is a piece of storage in the cluster that has been provisioned by an administrator or dynamically created.
It's a cluster resource, like a node, and exists independently of any pod.

```yml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

Access modes:

- `ReadWriteOnce` (RWO): Volume can be mounted as read-write by a single node
- `ReadOnlyMany` (ROX): Volume can be mounted as read-only by many nodes
- `ReadWriteMany` (RWX): Volume can be mounted as read-write by many nodes

### PersistentVolumeClaim (PVC)

A PersistentVolumeClaim is a request for storage by a user.
It's similar to how a pod consumes node resources - a PVC consumes PV resources.

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

Then you mount the PVC in your pod:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: nginx
    volumeMounts:
    - mountPath: "/usr/share/nginx/html"
      name: my-storage
  volumes:
  - name: my-storage
    persistentVolumeClaim:
      claimName: my-pvc
```

In many cloud environments, you don't need to create PVs manually.
The cluster can dynamically provision them based on StorageClasses when you create a PVC.

```bash
k get pv                         # List persistent volumes
k get pvc                        # List persistent volume claims
k describe pvc my-pvc            # See details and events
```

## How to Debug an issue

[Docs](https://kubernetes.io/docs/tasks/debug/debug-application/)

![Debug guide](./debug-flowchart.png)
[source](https://learnk8s.io/troubleshooting-deployments)

Here are some tips that I usually go through when investigating an issue:

- First of all get familiar with what SHOULD be running
- Validate the pods/deployments/services that you have them
- You can see events and validate the variables, and image versions with `k describe`
- See the latest global events `k get events --sort-by='.lastTimestamp'`
- Do you have limitations in your cluster, do you have enough e.g ReplicaSet slots for a new deployment? `k get quota`
- See if the persistent Volumes got created, and attachable
- The artifactory has the proper images and you can connect to it?

## Moving Forward

Maybe this lengthy post seemed overwhelming, but I must say this is just the top of the iceberg.
These were the low-level basic concepts, you can start to build up from here.

Here are some concepts that might be worthy to check out:

- CRD: Custom Resource Definition can extend the basic functionality
- RBAC: RoleBasedAccessControl
- kustomize: A tool to help you create templates for deployment
- helm: A way of encapulating applications to install in kubernetes

## Disclaimer

I don't take responsibility for any decisions you take based on my post, or any code that you run that might cause damage or financial loss.
I wrote this with an intention to help others, but I can not control how it's interpreted, and what actions are taken.

Happy coding!
