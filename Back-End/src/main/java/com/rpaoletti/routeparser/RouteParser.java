package com.rpaoletti.routeparser;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.javaparser.JavaParser;
import com.github.javaparser.ParseResult;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.Node;
import com.google.gson.Gson;
import com.rpaoletti.routeparser.model.Channel;
import com.rpaoletti.routeparser.model.IntegrationArchitecture;
import com.rpaoletti.routeparser.model.IntegrationNode;
import com.rpaoletti.routeparser.utils.ChoiceStruct;
import com.rpaoletti.routeparser.utils.NODE_TYPE;
import com.rpaoletti.routeparser.utils.Utils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class RouteParser {

    private String rawRoute;

    public IntegrationArchitecture A;

    public RouteParser(@JsonProperty("route") String rawRoute){
        this.rawRoute = rawRoute;
        A = new IntegrationArchitecture();
    }

    public String getRoute(){
        return rawRoute;
    }

    public void parseRoute(){
        JavaParser parser = new JavaParser();
        ParseResult<CompilationUnit> result = parser.parse(this.rawRoute);
        Optional<Node> configureNode = null;
        for (Node n : result.getResult().get().getChildNodes())
            configureNode=findConfigureNode(n);

        if(configureNode.isPresent()){
            Optional<List<Node>> routes = null;
            routes = findRoutes(configureNode.get());
            if(routes.isPresent()) getNewNodesAndChannels(routes.get());

        }else{
            System.out.println("Insert a valid Java File");
        }
    }

    private Optional<Node> findConfigureNode(Node node){

        if(node.toString().equals("configure")) {
            return node.getParentNode();
        }
        for (Node child : node.getChildNodes()){
            Optional<Node> configureNode = findConfigureNode(child);
            if(configureNode.isPresent())
                return configureNode;
        }
        return Optional.empty();
    }

    private Optional<List<Node>> findRoutes(Node node) {
        List<Node> routes = new ArrayList<>();
        if(node.toString().startsWith("from")){
            routes.add(node);
        } else {
            for (Node n : node.getChildNodes()) {
                Optional<List<Node>> routesFound = findRoutes(n);
                if (routesFound.isPresent()) {
                    routes = Stream.concat(routes.stream(), routesFound.get().stream())
                            .collect(Collectors.toList());
                }
            }
        }
        return Optional.of(routes);
    }

    private void getNewNodesAndChannels(List<Node> routes){
        for (Node route : routes) {
            List<String> commands = getCommands(route);

            LinkedList<ChoiceStruct> choiceQueue = new LinkedList<>();
            int choiceCount = 0;
            boolean endFlag = false;
            int previousNode = -1;
            boolean startChoice = false;
            for (int i = commands.size() - 1; i >= 0; i--) {
                for (String nodeCommand : Utils.NodeCommands)
                    if (commands.get(i).startsWith(nodeCommand)) {
                        String arguments = commands.get(i).substring(nodeCommand.length() + 1);
                        arguments = arguments.substring(0, arguments.length() - 1);
                        IntegrationNode n = null;
                        int node_id = -1;
                        switch (nodeCommand) {
                            case "from":
                            case "wireTap":
                            case "bean":
                            case "aggregate":
                            case "split":
                            case "process":
                            case "filter":
                            case "convertBodyTo":
                            case "setHeader":
                            case "setProperty":
                            case "enrich":
                            case "translate":
                            case "wrap":
                                if(!arguments.equals(""))
                                    n = new IntegrationNode(
                                            -1,
                                            Utils.matchCommand(nodeCommand) + " : " + arguments.trim(),
                                            new ArrayList<>(),
                                            new ArrayList<>()
                                    );
                                else
                                    n = new IntegrationNode(
                                            -1,
                                            Utils.matchCommand(nodeCommand),
                                            new ArrayList<>(),
                                            new ArrayList<>()
                                    );
                                node_id = A.insertNode(n);
                                if (choiceCount > 0) { // IF I AM IN A CHOICE
                                    if (endFlag) { //IF I AM THE FIRST NODE AFTER AN END COMMAND
                                        for (int leaf : choiceQueue.getFirst().leaves)
                                            A.insertChannel(new Channel(
                                                    leaf, null,  node_id, null
                                            ));
                                        choiceQueue.pop();
                                        endFlag = false;
                                        choiceCount--;
                                        if (choiceCount > 0) {
                                            choiceQueue.getFirst().lastID = node_id;
                                        }
                                    } else {
                                        if (startChoice) {
                                            A.insertChannel(new Channel(
                                                    choiceQueue.getFirst().lastChoiceID,
                                                    null,
                                                    node_id,
                                                    null
                                            ));
                                            startChoice = false;
                                        } else {
                                            A.insertChannel(new Channel(
                                                    choiceQueue.getFirst().lastID,
                                                    null,
                                                    node_id,
                                                    null
                                            ));
                                        }
                                        choiceQueue.getFirst().lastID = node_id;
                                    }
                                } else if (previousNode >= 0) { // IF I AM IN A STANDARD ROUTE
                                    A.insertChannel(new Channel(
                                            previousNode,
                                            null,
                                            node_id,
                                            null
                                    ));
                                }
                                previousNode = node_id;
                                break;
                            case "to": //SEND TO ENDPOINT
                            case "recipientList":
                                String[] argument = arguments.split(",");
                                for (String s : argument) {
                                    n = new IntegrationNode(
                                            -1,
                                            NODE_TYPE.ENDPOINT.toString() + " : " + s.trim(),
                                            new ArrayList<>(),
                                            new ArrayList<>());
                                    node_id = A.insertNode(n);
                                    n = A.getNodes().get(A.getNodes().size() - 1);

                                    if (choiceCount > 0) { // IF I AM IN A CHOICE
                                        if (endFlag) { //IF I AM THE FIRST NODE AFTER AN END COMMAND
                                            for (int leaf : choiceQueue.getFirst().leaves)
                                                A.insertChannel(new Channel(
                                                        leaf, null, node_id, null
                                                ));
                                            choiceQueue.pop();
                                            endFlag = false;
                                            choiceCount--;
                                            if (choiceCount > 0) {
                                                choiceQueue.getFirst().lastID = -1;
                                                startChoice = true;
                                            }
                                        } else {
                                            if (startChoice) {
                                                A.insertChannel(new Channel(
                                                        choiceQueue.getFirst().lastChoiceID,
                                                        null,
                                                        node_id,
                                                        null
                                                ));
                                            } else {
                                                A.insertChannel(new Channel(
                                                        choiceQueue.getFirst().lastID,
                                                        null,
                                                        node_id,
                                                        null
                                                ));
                                            }
                                            choiceQueue.getFirst().lastID = -1;
                                            startChoice = true;
                                        }
                                    } else if (previousNode >= 0) { // IF I AM IN A STANDARD ROUTE
                                        A.insertChannel(new Channel(
                                                previousNode,
                                                null,
                                                node_id,
                                                null
                                        ));
                                    }
                                    //previousNode = node_id;
                                }
                                break;
                            case "choice": //BRANCH THE ROUTE AMONG MULTIPLE SUB-ROUTES
                            case "multicast":
                                n = new IntegrationNode(
                                        -1,
                                        Utils.matchCommand(nodeCommand),
                                        new ArrayList<>(),
                                        new ArrayList<>()
                                );
                                node_id = A.insertNode(n);
                                if (choiceCount > 0) { // IF I AM IN A CHOICE
                                    if (endFlag) { //IF I AM THE FIRST NODE AFTER AN END COMMAND
                                        for (int leaf : choiceQueue.getFirst().leaves)
                                            A.insertChannel(new Channel(
                                                    leaf, null, node_id, null
                                            ));
                                        choiceQueue.pop();
                                        endFlag = false;
                                        choiceCount--;
                                        if (choiceCount > 0) {
                                            choiceQueue.getFirst().lastID = node_id;
                                        }
                                    } else { // I AM A STANDARD NODE IN A CHOICE
                                        if (startChoice) {
                                            A.insertChannel(new Channel(
                                                    choiceQueue.getFirst().lastChoiceID,
                                                    null,
                                                    node_id,
                                                    null
                                            ));
                                        } else {
                                            A.insertChannel(new Channel(
                                                    choiceQueue.getFirst().lastID,
                                                    null,
                                                    node_id,
                                                    null
                                            ));
                                        }
                                        choiceQueue.getFirst().lastID = node_id;
                                    }
                                } else if (previousNode >= 0) { // IF I AM IN A STANDARD ROUTE
                                    A.insertChannel(new Channel(
                                            previousNode,
                                            null,
                                            node_id,
                                            null
                                    ));
                                }
                                previousNode = node_id;
                                //CODE FOR CHANNELS
                                choiceCount++;
                                choiceQueue.push(new ChoiceStruct(node_id));
                                startChoice = true;
                                break;
                            case "endChoice": //END CHOICE BRANCH
                                if (choiceQueue.getFirst().lastID > 0)
                                    choiceQueue.getFirst().leaves.add(choiceQueue.getFirst().lastID);
                                startChoice = true;
                                break;
                            case "end": // END ALL CHOICE BRANCHES AND COME BACK TO MAIN ROUTE
                                endFlag = true;
                                startChoice = false;
                                break;
                            default:
                                break;
                        }
                        break;
                    }
            }
        }
    }

    private static List<String> getCommands(Node route){
        List<String> commands = new ArrayList<>();
        List<Node> childs = route.getChildNodes();
        if (childs.size()>=3 && Utils.NodeCommands.contains(childs.get(1).toString())){
            String newCommand = childs.get(1) + "(";
            for (int i = 2; i < childs.size()-1; i++) newCommand = newCommand + childs.get(i) + ", ";
            newCommand = newCommand + childs.get(childs.size()-1) + ")";
            commands.add(newCommand);
        }else if (childs.size()==2){
            boolean allLeaves = true;
            for (Node c : childs){
                if (!c.getChildNodes().isEmpty()){
                    allLeaves = false;
                    break;
                }
            }
            if (allLeaves){
                if (Utils.NodeCommands.contains(childs.get(0).toString()))
                    commands.add(childs.get(0) + "(" + childs.get(1) + ")");
            }else{
                if (Utils.NodeCommands.contains(childs.get(1).toString()))
                    commands.add(childs.get(1) + "(" + ")");
            }
        }
        for (Node c : childs)
            commands = Stream.concat(
                commands.stream(),
                getCommands(c).stream()).collect(Collectors.toList());
        return commands;
    }

    public String getJSON(){
        Gson gson = new Gson();
        String jsonStr = gson.toJson(A);
        return jsonStr;
    }

    private void printNodes(){
        System.out.println("Nodes: ");
        for (IntegrationNode s : A.getNodes()){
            System.out.println("---- " + s);
        }
    }

    private void printChannels(){
        System.out.println("Channels: ");
        for (Channel c : A.getChannels()){
            System.out.println("---- " + c);
        }
    }
}
