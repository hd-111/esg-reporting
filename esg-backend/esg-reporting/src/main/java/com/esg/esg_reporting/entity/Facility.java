package com.esg.esg_reporting.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String facilityName;

    private String location;

    @ManyToOne
    private ReportingOrganization organization;
}