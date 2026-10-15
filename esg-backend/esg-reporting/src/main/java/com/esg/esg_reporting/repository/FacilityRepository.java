package com.esg.esg_reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esg.esg_reporting.entity.Facility;

public interface FacilityRepository extends JpaRepository<Facility, Long> {

}