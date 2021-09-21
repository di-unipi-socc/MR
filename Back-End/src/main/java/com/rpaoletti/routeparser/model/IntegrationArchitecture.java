package com.rpaoletti.routeparser.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rpaoletti.routeparser.utils.IDGenerator;
import com.rpaoletti.routeparser.utils.Utils;

import javax.sound.midi.SysexMessage;
import java.util.*;

public class IntegrationArchitecture {

    private @JsonProperty List<IntegrationNode> nodes;
    private @JsonProperty List<Channel> channels;
    private @JsonProperty List<Channel> mismatches;

    private IDGenerator idGenerator;

    public IntegrationArchitecture() {
        nodes = new ArrayList<>();
        channels = new ArrayList<>();
        idGenerator = new IDGenerator();
        mismatches = new ArrayList<>();
    }

    public int insertNode(IntegrationNode node){
        int id = -1;
        for(int i=0;i<nodes.size();i++){
            if (nodes.get(i).equals(node)){ id=nodes.get(i).getId() ; break; }
        }
        if (id==-1) {
            node.setId(idGenerator.getUniqueId());
            nodes.add(node);
            id = node.getId();
        }
        return id;
    }

    public void insertChannel(Channel c){
        int pos = -1;
        for(int i=0;i<channels.size();i++){
            if (channels.get(i).equals(c)){ pos=i; break; }
        }
        if (pos==-1){
            channels.add(c);
        }
    }

    public List<IntegrationNode> getNodes() {
        return nodes;
    }

    public List<Channel> getChannels() {
        return channels;
    }

    public void setChannels(List<Channel> channels){
        this.channels = channels;
    }

    public void setIdGenerator(int id){
        this.idGenerator.setUniqueId(id);
    }

    private int getIndexOfNodeFromId(int id){
        for (int i = 0; i < nodes.size(); i++){
            if (nodes.get(i).getId() == id) return i;
        }
        return -1;
    }

    private void adaptToSimple(Channel c, NamedType ts){
        List<IntegrationNode> newNodes = new ArrayList<>();
        List<Channel> newChannels = new ArrayList<>();
        int nodeIndex = getIndexOfNodeFromId(c.getSource());
        int channelIndex = channels.indexOf(c);

        IntegrationNode t = new IntegrationNode(
                -1,
                "TRANSLATOR",
                List.of(ts),
                List.of(c.getDestType())
        );
        t.setId(idGenerator.getUniqueId());

        newNodes.add(t);
        newChannels.add(new Channel(
                t.getId(),
                c.getDestType(),
                c.getDest(),
                c.getDestType()
        ));
        if(c.getSourceType().isSimple()){
            newChannels.add(
              new Channel(
                      c.getSource(),
                      c.getSourceType(),
                      t.getId(),
                      c.getSourceType()
              )
            );
        }else{
            IntegrationNode cf = new IntegrationNode(
                    -1,
                    "CONTENT_FILTER",
                    List.of(c.getSourceType()),
                    List.of(ts)
            );
            cf.setId(idGenerator.getUniqueId());

            newNodes.add(cf);
            newChannels.add(
                    new Channel(
                            c.getSource(),
                            c.getSourceType(),
                            cf.getId(),
                            c.getSourceType()
                    )
            );
            newChannels.add(
                    new Channel(
                            cf.getId(),
                            ts,
                            t.getId(),
                            ts
            ));
        }
        nodes = Utils.union(nodes, newNodes, nodeIndex + 1);
        //channels.remove(c);
        channels = Utils.union(channels, newChannels, channelIndex + 1);
    }

    private void adaptToComposite(Channel c, Map<NamedType, NamedType> chosenSimilarSet){
        List<IntegrationNode> newNodes = new ArrayList<>();
        List<Channel> newChannels = new ArrayList<>();

        int nodeIndex = getIndexOfNodeFromId(c.getSource());
        int channelIndex = channels.indexOf(c);

        NamedType filterSet = new NamedType("filterSet", null, new ArrayList<>(), "composite");
        NamedType translatedFilterSet = new NamedType("translatedFilterSet", null, new ArrayList<>(), "composite");

        for(NamedType t : Utils.leaves(c.getDestType())){
            for (var e : chosenSimilarSet.entrySet()) {
                if (t.equals(e.getKey())) {
                    filterSet.getTypeset().add(e.getValue());
                    translatedFilterSet.getTypeset().add(t);
                    break;
                }
            }
        }

        IntegrationNode cf = new IntegrationNode(
                -1,
                "CONTENT_FILTER",
                List.of(c.getSourceType()),
                filterSet.getTypeset()
        );
        cf.setId(idGenerator.getUniqueId());

        IntegrationNode t = new IntegrationNode(
                -1,
                "TRANSLATOR",
                filterSet.getTypeset(),
                translatedFilterSet.getTypeset()
        );
        t.setId(idGenerator.getUniqueId());

        IntegrationNode w = new IntegrationNode(
                -1,
                "TR_WRAPPER",
                translatedFilterSet.getTypeset(),
                List.of(c.getDestType())
        );
        w.setId(idGenerator.getUniqueId());

        newNodes.addAll(List.of(cf, t, w));
        newChannels.addAll(List.of(
                new Channel(c.getSource(),c.getSourceType(),cf.getId(),c.getSourceType()),
                new Channel(cf.getId(),filterSet,t.getId(),filterSet),
                new Channel(t.getId(),translatedFilterSet,w.getId(),translatedFilterSet),
                new Channel(w.getId(),c.getDestType(),c.getDest(),c.getDestType())
        ));
        nodes = Utils.union(nodes, newNodes, nodeIndex);
        //channels.remove(c);
        channels = Utils.union(channels, newChannels, channelIndex);
    }

    public void mismatchResolver(){
        List<Channel> channelsToRemove = new ArrayList<>();
        for (Channel c : channels){
            if (!Utils.isCompatible(c.getSourceType(),c.getDestType())){
                if(Utils.isAdaptable(c.getSourceType(), c.getDestType())) {
                    channelsToRemove.add(c);
                    if (c.getDestType().isSimple()) {
                        NamedType ts;
                        if (c.getSourceType().isSimple()) ts = c.getSourceType();
                        else ts = Utils.similarSet(c.getDestType(), c.getSourceType()).get(0);
                        adaptToSimple(c, ts);
                    } else {
                        //TODO here the choice of the best type is made with get(0) waiting for other implementations
                        var simsets = Utils.similarSets(c.getDestType(), c.getSourceType());
                        Map<NamedType, NamedType> chosenSimilarSet = new HashMap<>();
                        for (var e : simsets.entrySet())
                            chosenSimilarSet.put(e.getValue().get(0), e.getKey());

                        adaptToComposite(c, chosenSimilarSet);
                    }
                }else{
                    mismatches.add(c);
                }
            }
        }
        for (Channel c : channelsToRemove)
            channels.remove(c);
    }

    public void analyze () {
        for (Channel c : channels){
            if (!Utils.isCompatible(c.getSourceType(),c.getDestType())){
                mismatches.add(c);
            }
        }
    }

    @Override
    public String toString() {
        return "IntegrationArchitecture{" +
                "nodes=" + nodes +
                ", channels=" + channels +
                ", mismatches=" + mismatches +
                '}';
    }
}
