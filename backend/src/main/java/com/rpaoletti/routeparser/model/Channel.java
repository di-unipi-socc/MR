package com.rpaoletti.routeparser.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Channel {

    private final int source;
    private NamedType sourceType;
    private final int dest;
    private NamedType destType;

    public Channel(
            @JsonProperty int source,
            @JsonProperty NamedType sourceType,
            @JsonProperty int dest,
            @JsonProperty NamedType destType
    ) {
        this.source = source;
        this.sourceType = sourceType;
        this.dest = dest;
        this.destType = destType;
    }

    public int getSource() {
        return source;
    }

    public NamedType getSourceType() {
        return sourceType;
    }

    public int getDest() {
        return dest;
    }

    public NamedType getDestType() {
        return destType;
    }

    @Override
    public String toString() {
        return "Channel{" +
                "source=" + source +
                ", sourceType=" + sourceType +
                ", dest=" + dest +
                ", destType=" + destType +
                '}';
    }

    public boolean equals (Channel c) {
        if (this.source == c.source && this.dest == c.dest) {
            if (this.sourceType == null && c.sourceType != null) return false;
            if (this.sourceType != null && c.sourceType == null) return false;
            if (this.destType == null && c.destType != null) return false;
            if (this.destType != null && c.destType == null) return false;
            if ((this.sourceType == null && c.sourceType == null) || (this.sourceType.equals(c.sourceType))){
                if ((this.destType == null && c.destType == null) || (this.destType.equals(c.destType))){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } else {
            return false;
        }
    }
}
