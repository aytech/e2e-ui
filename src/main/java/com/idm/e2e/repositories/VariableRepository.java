package com.idm.e2e.repositories;

import com.idm.e2e.entities.VariableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VariableRepository extends JpaRepository<VariableEntity, Long> {

    @Query("select Variable from VariableEntity Variable join Variable.user User where User.id = :user_id and Variable.id = :variable_id")
    VariableEntity findByIdAndUser(@Param("user_id") long userID, @Param("variable_id") long variableID);

    @Query("select Variable from VariableEntity Variable join Variable.user User where User.id = :user_id")
    List<VariableEntity> findAllByUser(@Param("user_id") long userId);

    @Transactional
    @Modifying
    @Query("update VariableEntity Variable set Variable.key = :key, Variable.value = :value where Variable.id  = :variable_id")
    Integer updateVariable(@Param("key") String key, @Param("value") String value, @Param("variable_id") long variable_id);
}
