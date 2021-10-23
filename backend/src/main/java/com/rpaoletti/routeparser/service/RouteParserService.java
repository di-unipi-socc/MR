package com.rpaoletti.routeparser.service;

import com.rpaoletti.routeparser.RouteParser;
import com.rpaoletti.routeparser.model.Channel;
import com.rpaoletti.routeparser.model.IntegrationArchitecture;
import com.rpaoletti.routeparser.model.IntegrationNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteParserService {

    private RouteParser routeParser;

    @Autowired
    public RouteParserService() {
    }

    public void addRouteParser(RouteParser parser){
        this.routeParser = parser;
    }

    public String getRoute(){
        return routeParser.getRoute();
    }

    public void parseRoute(){
        routeParser.parseRoute();
    }

    public List<IntegrationNode> getNodes(){
        return routeParser.A.getNodes();
    }

    public List<Channel> getChannels(){
        return routeParser.A.getChannels();
    }

    public void addNode(IntegrationNode n){
        this.routeParser.A.insertNode(n);
    }

    public void addChannel(Channel c){
        this.routeParser.A.insertChannel(c);
    }

    public String getIntegration(){
        return routeParser.getJSON();
    }

    public void setArchitecture(IntegrationArchitecture architecture){
        this.routeParser.A = architecture;
        this.routeParser.A.setIdGenerator(this.routeParser.A.getNodes().size());
    }

    public IntegrationArchitecture getFixedArchitecture(){
        this.routeParser.A.mismatchResolver();
        return this.routeParser.A;
    }

    public IntegrationArchitecture getAnalyzedArchitecture(){
        this.routeParser.A.analyze();
        return this.routeParser.A;
    }
}
