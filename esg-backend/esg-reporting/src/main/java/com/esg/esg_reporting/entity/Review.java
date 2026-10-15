package com.esg.esg_reporting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reviewerName;

    private String decision;

    private String comment;

    private LocalDateTime reviewedAt;

    @ManyToOne
    private MetricEntry metricEntry;
    
    @PrePersist
    public void setReviewedAt() {
        reviewedAt = LocalDateTime.now();
    }
}