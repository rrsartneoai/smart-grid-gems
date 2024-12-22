# Architecture Documentation

## Overview
This document describes the architecture of our RAG-based chatbot system. The system is divided into three main layers:

1. **Communication Layer**: Handles user interactions through the chatbot interface
2. **Processing Layer**: Contains the RAG engine and knowledge base for document processing and response generation
3. **Input Layer**: Manages file processing for different document types

## Viewing the Architecture Diagram
The architecture is documented using PlantUML. To view the diagram:

1. Install PlantUML plugin in your IDE or
2. Use online PlantUML editor at https://www.plantuml.com/plantuml/
3. Copy the contents of `architecture.puml` and render it

## Components Description

### Communication Layer
- **User**: End user interacting with the system
- **Digital Assistant**: Chatbot interface handling user queries

### Processing Layer
- **Knowledge Base**: Stores processed document chunks and embeddings
- **RAG Engine**: Handles search, inference, and response generation

### Input Layer
- **File Processing**: Handles different file types (PDF, DOCX, Images)