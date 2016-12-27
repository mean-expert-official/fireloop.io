---
title: Tabla de comparación
language: es
---

## Tabla de comparación

| Plataforma  | Meteor  | Horizon  | FireBase  | FireLoop  |
|-----------------------|---|---|---|---|
| Description | Plataforma de código abierto para web, móvil y escritorio.   | Real-time platform built on top of RethinkDB.  | BackEnd as A Service para el desarrollo de aplicaciones clientes   |  plataforma en Real-time basada en LoopBack and Express.js. |
| Real-Time             | Si  | Si  | Si  | Si  |
| UI Components         | Si  | No  | No  | No UI pero WebRTC Componentes para Angular 2 están en desarrollo.  |
| Client SDK            | Monolithic | JavaScript Client  | SDKs para diferentes lenguajes  | Full tipado Angular 2 SDK |
| Extensibilidad         | Meteor Modules | Todavía no implementado Mecanismo de complemento o pluguin | Nope | Isomorphica (Universal) Models, Hooks, Mixins y  Componentes.
| Escalabilidad           | Usa MongoDB OpLog | Usa RethinkDB | Escalado automático| Arquitectura impulsada por adaptador o driver (Options: MongoDB PubSub, Redis, Kafka, Build your own driver) |
| Madurez              | Very mature | No es tan madura, muchas piezas no están en su lugar | Muy madura | Madura ya que se basa en LoopBack Maturity plus Modern Community Modules.|
| Open Source           | Si | Si | No | Si |