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
draft: true
---

So you've joined a new project as a developer, and that project uses Kubernetes.
Everyone around you uses terms like `pods`, `deployments` and `configmaps` and you don't reeally know what they mean.
Let me help you get started.

<!--more-->

I'd like to give you a high level overview and basic commands to get started. 
I try to be understandable rather than deep technical, there's a lot of ground to cover.

I use it in my day to day job, I have enough knowledge to get by, but might not always know the latest nuances.
I'd like to share some snippets to get you started.

For every component I'll link the official documents that contain the latest information,
you should always trust the official sources more than random blog posts.

## What is Kubernetes

## Useful Resources

- [Official docs](https://kubernetes.io/)
- [Kubernetes GitHub](https://github.com/kubernetes)
- [Kubernetes Comic](https://cloud.google.com/kubernetes-engine/kubernetes-comic)

### How can I try it out

Docker for Desktop Kubernetes Cluster

k8s

### kubectl

```bash
alias k=kubectl
```

get
apply
describe
port-forward
scale
delete
cp
create
run
label

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

## Configuriation

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

LoadBalancers
NodePorts
ClusterPort

TargetPort: port inside the container
Port: port seen from the outside

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
      port: 1313
      protocol: TCP
      targetPort: 8080
```

### Ingress

[Docs](https://kubernetes.io/docs/concepts/services-networking/ingress/)

## Storage

[Docs](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

PersistentVolume

PersistentVolumeClaim

## How to Debug an issue

[Docs](https://kubernetes.io/docs/tasks/debug/debug-application/)

![Debug guide](./debug-flowchart.png)
[source](https://learnk8s.io/troubleshooting-deployments)

Here are some tips that I usually go through when incestigating an issue:

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
